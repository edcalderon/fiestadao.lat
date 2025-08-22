import { useState, useEffect } from 'react';
import { useFiestaDAO } from '../context/FiestaDAOContext';
import { formatEther } from 'ethers';

interface ProposalManagerFormProps {
  onClose: () => void;
}

export default function ProposalManagerForm({ onClose }: ProposalManagerFormProps) {
  const { 
    createProposal, 
    getActiveProposals, 
    voteOnProposal,
    loading, 
    error, 
    isConnected,
    votingPower,
    minStakeToPropose,
    refreshVotingPower
  } = useFiestaDAO();
  
  const [proposals, setProposals] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('1');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingInProgress, setVotingInProgress] = useState<Record<number, boolean>>({});
  
  // Format values for display
  const minStakeFormatted = formatEther(minStakeToPropose || 0n);
  const userStakeFormatted = formatEther(votingPower || 0n);
  const hasEnoughStake = (votingPower || 0n) >= (minStakeToPropose || 0n);
  
  const loadProposals = async () => {
    try {
      const activeProposals = await getActiveProposals();
      setProposals(activeProposals);
    } catch (err) {
      console.error('Failed to load proposals:', err);
      setFormError('Failed to load proposals');
    }
  };

  const handleVote = async (proposalId: number, support: boolean) => {
    if (loading || votingInProgress[proposalId]) return;
    
    try {
      setVotingInProgress(prev => ({ ...prev, [proposalId]: true }));
      setFormError(null);
      
      await voteOnProposal(proposalId, support);
      await loadProposals(); // Refresh the proposals to show updated vote counts
    } catch (err: any) {
      console.error('Error voting on proposal:', err);
      setFormError(err.message || 'Failed to submit vote');
    } finally {
      setVotingInProgress(prev => ({ ...prev, [proposalId]: false }));
    }
  };
  
  useEffect(() => {
    if (isConnected) {
      loadProposals();
      refreshVotingPower();
    }
  }, [isConnected]);
  
  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form
    if (!title.trim()) {
      setFormError('Please enter a title for your proposal');
      return;
    }
    
    if (!description.trim()) {
      setFormError('Please enter a description for your proposal');
      return;
    }
    
    if (!hasEnoughStake) {
      setFormError(`Insufficient stake. You need at least ${minStakeFormatted} ASTR to create a proposal.`);
      return;
    }
    
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      await createProposal(Number(projectId), title, description);
      setTitle('');
      setDescription('');
      await loadProposals();
      onClose(); // Close the modal after successful proposal creation
    } catch (err: any) {
      console.error('Error creating proposal:', err);
      setFormError(err.message || 'Failed to create proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Please connect your wallet to interact with proposals</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create New Proposal</h2>
          <div className="text-sm text-gray-600">
            Your stake: <span className="font-medium">{userStakeFormatted} ASTR</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${hasEnoughStake ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {hasEnoughStake ? 'Eligible' : `Min ${minStakeFormatted} ASTR needed`}
            </span>
          </div>
        </div>
        
        <form onSubmit={handleCreateProposal} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Project ID</label>
              <input
                type="number"
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="1"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Enter the project ID this proposal is for</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <h3 className="text-sm font-medium text-gray-700">Voting Power</h3>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: hasEnoughStake ? '100%' : `${(Number(userStakeFormatted) / Number(minStakeFormatted)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {userStakeFormatted} / {minStakeFormatted} ASTR
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter proposal title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Describe your proposal in detail..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Be clear and concise. Include any relevant links or resources.
            </p>
          </div>
          
          {(error || formError) && (
            <div className="p-3 rounded-md bg-red-50">
              <p className="text-sm text-red-700">{error || formError}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {!hasEnoughStake && (
                <p className="text-yellow-700">
                  Stake more ASTR to create proposals. Minimum required: {minStakeFormatted} ASTR
                </p>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !hasEnoughStake}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading || !hasEnoughStake 
                    ? 'bg-indigo-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : 'Create Proposal'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Active Proposals</h2>
        {proposals.length === 0 ? (
          <p>No active proposals found.</p>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold">{proposal.title}</h3>
                <p className="text-gray-600 mt-1">{proposal.description}</p>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    Project ID: {proposal.projectId}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Votes For: {proposal.votesFor.toString()}</span>
                    <span>Votes Against: {proposal.votesAgainst.toString()}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Ends: {proposal.endTime.toLocaleString()}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleVote(proposal.id, true)}
                    className={`px-3 py-1 ${votingInProgress[proposal.id] ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white rounded transition-colors flex items-center gap-2`}
                    disabled={loading || votingInProgress[proposal.id]}
                  >
                    {votingInProgress[proposal.id] ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Yes (${proposal.yesVotes.toString()})`
                    )}
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, false)}
                    className={`px-3 py-1 ${votingInProgress[proposal.id] ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white rounded transition-colors flex items-center gap-2`}
                    disabled={loading || votingInProgress[proposal.id]}
                  >
                    {votingInProgress[proposal.id] ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `No (${proposal.noVotes.toString()})`
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
