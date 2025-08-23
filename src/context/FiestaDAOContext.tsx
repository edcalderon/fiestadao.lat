'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useActiveAccount, useActiveWallet, useReadContract, useSendTransaction } from '@thirdweb/react';
import { prepareContractCall, getContract, readContract, createThirdwebClient } from 'thirdweb';

// Import client from thirdweb configuration
import { client } from '@/lib/thirdweb';
import { Proposal } from '@/types/proposal.types';

interface FiestaDAOContextType {
  contract: any;
  isConnected: boolean;
  address: string | undefined;
  votingPower: bigint;
  minStakeToPropose: bigint;
  createProposal: (projectId: number, title: string, description: string) => Promise<void>;
  getActiveProposals: () => Promise<any[]>;
  voteOnProposal: (proposalId: number, support: boolean) => Promise<void>;
  stakeTokens: (amount: bigint) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshVotingPower: () => Promise<void>;
}

const FiestaDAOContext = createContext<FiestaDAOContextType | undefined>(undefined);

export const FiestaDAOProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [votingPower, setVotingPower] = useState<bigint>(0n);
  const [minStakeToPropose, setMinStakeToPropose] = useState<bigint>(10n * 10n**18n); // Default 10 ASTR
  
  const account = useActiveAccount();
  const address = account?.address;
  const isConnected = !!account;
  const chain = useActiveWalletChain();
  const { mutate: sendTransaction } = useSendTransaction();
  
  // Initialize contract with thirdweb client
  const [contract, setContract] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      const contractInstance = getContract({
        client,
        chain: { 
          id: 81, 
          name: 'Shibuya', 
          rpc: 'https://evm.shibuya.astar.network' 
        },
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      });
      setContract(contractInstance);
    }
  }, []);
  const [contractError, setContractError] = useState<string | null>(null);

  useEffect(() => {
    const initContract = () => {
      try {
        if (!chain) {
          setContractError('No active chain detected');
          return null;
        }
        
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        
        if (!contractAddress) {
          setContractError('Contract address is not configured');
          return null;
        }
        
        if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
          setContractError('Invalid contract address format');
          return null;
        }
        
        const contractInstance = getContract({
          client: { clientId: "", secretKey: "" },
          chain: chain,
          address: contractAddress,
        });
        
        setContract(contractInstance);
        setContractError(null);
        return contractInstance;
      } catch (error) {
        console.error('Error initializing contract:', error);
        setContractError('Failed to initialize contract');
        return null;
      }
    };
    
    initContract();
  }, [chain]);

  const createProposal = async (projectId: number, title: string, description: string) => {
    if (!contract) {
      throw new Error(contractError || 'Contract not initialized');
    }
    setLoading(true);
    setError(null);
    
    try {
      const tx = prepareContractCall({
        contract,
        method: 'function createProposal(uint256 projectId, string memory title, string memory description)',
        params: [BigInt(projectId), title, description]
      });
      
      await sendTransaction(tx);
    } catch (err: any) {
      console.error('Error creating proposal:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const [totalProposals, setTotalProposals] = useState<bigint>(0n);
  const [activeProposals, setActiveProposals] = useState<any[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);

  // Fetch total proposals when contract is available
  useEffect(() => {
    if (!contract) return;

    const fetchTotalProposals = async () => {
      try {
        const result = await readContract({
          contract,
          method: "function getTotalProposals() view returns (uint256)",
        });
        setTotalProposals(result as bigint);
      } catch (err) {
        console.error('Error fetching total proposals:', err);
        setError('Failed to fetch total proposals');
      }
    };

    fetchTotalProposals();
  }, [contract]);

  const getActiveProposals = useCallback(async () => {
    if (!contract) return [];
    
    setIsLoadingProposals(true);
    setError(null);
    
    try {
      const total = Number(totalProposals);
      const proposals = [];
      
      // Fetch each proposal individually
      for (let i = 1; i <= total; i++) {
        try {
          type RawProposal = [bigint, bigint, string, string, bigint, bigint, bigint, boolean, boolean];
          const response = await readContract({
            contract,
            method: "function getProposal(uint256) view returns (tuple(uint256,uint256,string,string,uint256,uint256,uint256,bool,bool))",
            params: [BigInt(i)]
          }) as unknown as RawProposal;
          
          // Map the tuple response to the Proposal interface
          const proposal: Proposal = {
            id: response[0],
            projectId: response[1],
            title: response[2],
            description: response[3],
            votesFor: response[4],
            votesAgainst: response[5],
            endTime: response[6],
            executed: response[7],
            passed: response[8],
            ...Object.fromEntries(response.map((val, idx) => [idx, val]))
          };
          
          // Only include active proposals (not executed and voting period not ended)
          if (!proposal.executed && Number(proposal.endTime) > Math.floor(Date.now() / 1000)) {
            proposals.push({
              id: proposal.id,
              projectId: proposal.projectId,
              title: proposal.title,
              description: proposal.description,
              votesFor: proposal.votesFor,
              votesAgainst: proposal.votesAgainst,
              endTime: Number(proposal.endTime),
              executed: proposal.executed,
              passed: proposal.passed
            });
          }
        } catch (err) {
          console.warn(`Failed to fetch proposal ${i}:`, err);
        }
      }
      
      setActiveProposals(proposals);
      return proposals;
    } catch (err: any) {
      console.error('Error fetching proposals:', err);
      setError('Failed to fetch proposals');
      return [];
    } finally {
      setIsLoadingProposals(false);
    }
  }, [contract, totalProposals]);

  const voteOnProposal = async (proposalId: number, support: boolean) => {
    if (!contract) throw new Error('Contract not initialized');
    setLoading(true);
    setError(null);
    
    try {
      const tx = prepareContractCall({
        contract,
        method: 'function voteOnProposal(uint256 proposalId, bool support)',
        params: [BigInt(proposalId), support]
      });
      
      await sendTransaction(tx);
    } catch (err: any) {
      console.error('Error voting on proposal:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Stake tokens function
  const stakeTokens = async (amount: bigint) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    
    if (amount <= 0n) {
      throw new Error('Amount must be greater than 0');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const tx = prepareContractCall({
        contract,
        method: 'function stakeTokens()',
        value: amount
      });
      
      // Send the transaction and wait for it to be included in a block
      console.log('Sending staking transaction...');
      const result = await sendTransaction(tx);
      
      console.log('Transaction submitted, waiting for confirmation...');
      
      // Wait for the transaction to be confirmed
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds to ensure confirmation
      
      // Refresh voting power after confirmation
      await refreshVotingPower();
      
      return result;
    } catch (err: any) {
      console.error('Error staking tokens:', err);
      setError(err.message || 'Failed to stake tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh user's voting power
  const refreshVotingPower = useCallback(async () => {
    if (!contract || !address) return;
    
    try {
      // Get voting power using the stakedTokens mapping (which is what votingPower tracks)
      const stakedTokens = await readContract({
        contract,
        method: 'function stakedTokens(address) view returns (uint256)',
        params: [address]
      });
      setVotingPower(BigInt(stakedTokens.toString()));
      
      // Get minimum stake requirement using the correct contract method
      const minStake = await readContract({
        contract,
        method: 'function MIN_STAKE_TO_CREATE_PROPOSAL() view returns (uint256)'
      });
      setMinStakeToPropose(BigInt(minStake.toString()));
    } catch (err) {
      console.error('Error refreshing voting power:', err);
      setError('Failed to refresh voting power');
    }
  }, [contract, address]);
  
  // Load voting power when contract or address changes
  useEffect(() => {
    if (contract && address) {
      refreshVotingPower();
    }
  }, [contract, address, refreshVotingPower]);

  return (
    <FiestaDAOContext.Provider 
      value={{ 
        contract, 
        isConnected, 
        address,
        votingPower,
        minStakeToPropose,
        createProposal,
        getActiveProposals,
        voteOnProposal,
        stakeTokens,
        loading,
        error,
        refreshVotingPower
      }}
    >
      {children}
    </FiestaDAOContext.Provider>
  );
};

export const useFiestaDAO = (): FiestaDAOContextType => {
  const context = useContext(FiestaDAOContext);
  if (context === undefined) {
    throw new Error('useFiestaDAO must be used within a FiestaDAOProvider');
  }
  return context;
};
