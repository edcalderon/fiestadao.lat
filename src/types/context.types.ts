export interface FiestaDAOContextType {
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