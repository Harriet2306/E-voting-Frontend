import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { candidatesAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

interface Candidate {
  id: string;
  name: string;
  program: string;
  photoUrl: string | null;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  position: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
    regNo?: string;
  };
  _count?: {
    votes: number;
  };
}

interface CandidatesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateDeleted?: () => void;
  onSuccess?: () => void;
}

const CandidatesListModal: React.FC<CandidatesListModalProps> = ({ 
  isOpen, 
  onClose, 
  onCandidateDeleted, 
  onSuccess 
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCandidates();
    }
  }, [isOpen]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await candidatesAPI.getAll();
      setCandidates(data);
    } catch (err: any) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete candidate "${name}"? This action cannot be undone if they have votes.`)) {
      return;
    }

    setDeleting(id);
    try {
      await candidatesAPI.delete(id);
      toast.success('Candidate deleted successfully');
      // Refresh the list immediately
      await fetchCandidates();
      if (onCandidateDeleted) {
        onCandidateDeleted();
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete candidate';
      // If candidate not found, it might have already been deleted - refresh list and show info message
      if (errorMessage.includes('not found') || err.response?.status === 404) {
        toast.success('Candidate already removed. Refreshing list...');
        await fetchCandidates();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      const response = await candidatesAPI.deleteAll();
      const deletedCount = response.deletedCount || 0;
      const skippedCount = response.skippedCount || 0;
      
      if (deletedCount > 0 && skippedCount > 0) {
        toast.success(response.message || `${deletedCount} candidate(s) deleted. ${skippedCount} skipped (have votes).`);
      } else if (deletedCount > 0) {
        toast.success(response.message || `All ${deletedCount} candidate(s) deleted successfully`);
      } else if (skippedCount > 0) {
        toast.error(response.message || `No candidates deleted. All ${skippedCount} candidate(s) have votes.`);
      } else {
        toast.success(response.message || 'No candidates found to delete');
      }
      
      setShowDeleteAllConfirm(false);
      // Refresh the list immediately
      await fetchCandidates();
      if (onCandidateDeleted) {
        onCandidateDeleted();
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete all candidates';
      toast.error(errorMessage);
      // Refresh list anyway to show current state
      await fetchCandidates();
    } finally {
      setDeletingAll(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Manage Candidates</CardTitle>
                <CardDescription>View and manage all registered candidates</CardDescription>
              </div>
              <div className="flex gap-2">
                {candidates.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteAllConfirm(true)}
                    disabled={deletingAll || deleting !== null}
                  >
                    {deletingAll ? 'Deleting...' : '🗑️ Delete All'}
                  </Button>
                )}
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">👤</div>
                <p className="text-sm text-gray-500">No candidates registered yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Candidate Photo */}
                      <div className="flex-shrink-0">
                        {candidate.photoUrl ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5656'}${candidate.photoUrl}`}
                            alt={candidate.name}
                            className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=6366f1&color=fff&size=128&bold=true`;
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-lg border shadow-sm bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                              {candidate.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{candidate.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(candidate.status)}`}>
                            {candidate.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Position:</strong> {candidate.position.name}</p>
                          <p><strong>Program:</strong> {candidate.program}</p>
                          <p><strong>Email:</strong> {candidate.user.email}</p>
                          {candidate.user.regNo && (
                            <p><strong>Registration No:</strong> {candidate.user.regNo}</p>
                          )}
                          {candidate._count && candidate._count.votes > 0 && (
                            <p className="text-orange-600 font-semibold">
                              ⚠️ Has {candidate._count.votes} vote(s)
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(candidate.id, candidate.name)}
                          disabled={deleting === candidate.id || deletingAll || (candidate._count?.votes || 0) > 0}
                        >
                          {deleting === candidate.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                    {(candidate._count?.votes || 0) > 0 && (
                      <p className="text-xs text-slate-600 mt-2">
                        ⚠️ Cannot delete: Candidate has {candidate._count?.votes || 0} vote(s). Delete votes first.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete All Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">⚠️ Delete All Candidates?</CardTitle>
              <CardDescription>
                <div className="space-y-2">
                  <p className="font-semibold text-red-700">This will permanently delete:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                    <li>All {candidates.length} candidate(s)</li>
                    <li>All candidate files (photos, manifestos)</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Note:</strong> Candidates with votes cannot be deleted. This will only delete candidates without votes.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>This action cannot be undone.</strong>
                  </p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowDeleteAllConfirm(false)} disabled={deletingAll}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAll} disabled={deletingAll}>
                  {deletingAll ? 'Deleting...' : 'Yes, Delete All'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CandidatesListModal;

