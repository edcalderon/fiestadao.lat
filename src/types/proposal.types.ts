export interface Proposal {
    id: bigint;
    projectId: bigint;
    title: string;
    description: string;
    votesFor: bigint;
    votesAgainst: bigint;
    endTime: bigint;
    executed: boolean;
    passed: boolean;
    [key: number]: any; // For tuple access
  }
  