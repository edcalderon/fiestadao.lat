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

export type RawProposal = [
  bigint,   // id
  bigint,   // projectId
  string,   // title
  string,   // description
  bigint,   // votesFor
  bigint,   // votesAgainst
  bigint,   // endTime
  boolean,  // executed
  boolean   // passed
];