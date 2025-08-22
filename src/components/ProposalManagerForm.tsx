import { useState, useEffect } from 'react';
import { useFiestaDAO } from '../context/FiestaDAOContext';

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
    isConnected 
  } = useFiestaDAO();
  
  const [proposals, setProposals] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('1');
  
  const loadProposals = async () => {
    try {
      const activeProposals = await getActiveProposals();
      setProposals(activeProposals);
    } catch (err) {
      console.error('Failed to load proposals:', err);
    }
  };
  
  useEffect(() => {
    if (isConnected) {
      loadProposals();
    }
  }, [isConnected]);
  
  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    try {
      await createProposal(Number(projectId), title, description);
      setTitle('');
      setDescription('');
      await loadProposals();
      onClose(); // Close the modal after successful proposal creation
    } catch (err) {
      console.error('Error creating proposal:', err);
    }
  };
  
  const handleVote = async (proposalId: number, support: boolean) => {
    try {
      await voteOnProposal(proposalId, support);
      await loadProposals();
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  if (!isConnected) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Please connect your wallet to interact with proposals</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Create New Proposal</h2>
        <form onSubmit={handleCreateProposal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Proposal'}
          </button>
        </form>
        {error && <div className="mt-4 text-red-600">{error}</div>}
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
                    disabled={loading}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm"
                  >
                    Vote For
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, false)}
                    disabled={loading}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm"
                  >
                    Vote Against
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
