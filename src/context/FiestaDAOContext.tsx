'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useActiveAccount, useActiveWalletChain, useReadContract, useSendTransaction } from 'thirdweb/react';
import { prepareContractCall, getContract, readContract } from 'thirdweb';
import { Proposal } from '@/types/proposal.types';

interface FiestaDAOContextType {
  contract: any;
  isConnected: boolean;
  address: string | undefined;
  createProposal: (projectId: number, title: string, description: string) => Promise<void>;
  getActiveProposals: () => Promise<any[]>;
  voteOnProposal: (proposalId: number, support: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const FiestaDAOContext = createContext<FiestaDAOContextType | undefined>(undefined);

export const FiestaDAOProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const account = useActiveAccount();
  const address = account?.address;
  const isConnected = !!account;
  const chain = useActiveWalletChain();
  const { mutate: sendTransaction } = useSendTransaction();
  
  // Initialize contract with null check and error handling
  const [contract, setContract] = useState<any>(null);
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

  return (
    <FiestaDAOContext.Provider value={{
      contract,
      isConnected,
      address,
      createProposal,
      getActiveProposals,
      voteOnProposal,
      loading,
      error: error || contractError,
    }}>
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
