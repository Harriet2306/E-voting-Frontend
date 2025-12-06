// Authored by: Treasure Kirabo
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { votesAPI } from '../services/api';
import { toast } from 'sonner';
import { getFileUrl } from '../lib/imageUtils';
import Logo from '../components/ui/Logo';

interface Position {
  id: string;
  name: string;
  seats: number;
  votingOpens: string;
  votingCloses: string;
}

interface Candidate {
  id: string;
  name: string;
  program: string;
  photoUrl: string | null;
  status: string;
  position: {
    id: string;
    name: string;
  };
}

interface BallotData {
  positions: Position[];
  candidates: Candidate[];
}

const VotingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ballotToken, setBallotToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ballotData, setBallotData] = useState<BallotData | null>(null);
  const [votes, setVotes] = useState<{ [positionId: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const token = location.state?.ballotToken || localStorage.getItem('ballotToken');

    if (!token) {
      toast.error('No ballot token found. Please verify your identity first.');
      navigate('/verify');
      return;
    }

    setBallotToken(token);
    loadBallot(token);
  }, [location, navigate]);

  const loadBallot = async (token: string) => {
    setLoading(true);
    try {
      const ballotResponse = await votesAPI.getBallot(token);
      setBallotData({
        positions: ballotResponse.positions || [],
        candidates: ballotResponse.candidates || [],
      });

      if (ballotResponse.positions?.length > 0 && ballotResponse.candidates?.length === 0) {
        toast.error('No approved candidates available for voting yet.', { duration: 5000 });
      }
    } catch (err: any) {
      console.error('Failed to load ballot:', err);
      if (err.response?.status === 401 || err.response?.status === 400) {
        toast.error('Invalid or expired ballot token. Please verify again.');
        localStorage.removeItem('ballotToken');
        navigate('/verify');
      } else {
        toast.error('Failed to load ballot');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoteChange = (positionId: string, candidateId: string) => {
    if (votes[positionId] === candidateId) {
      const newVotes = { ...votes };
      delete newVotes[positionId];
      setVotes(newVotes);
      return;
    }

    setVotes({
      ...votes,
      [positionId]: candidateId,
    });
  };

  const calculateProgress = () => {
    if (!ballotData || ballotData.positions.length === 0) return 0;
    return (Object.keys(votes).length / ballotData.positions.length) * 100;
  };

  const handleSubmit = async () => {
    if (!ballotData) return;

    const missingPositions = ballotData.positions.filter((pos) => !votes[pos.id]);

    if (missingPositions.length > 0) {
      toast.error(`Please vote for: ${missingPositions.map((p) => p.name).join(', ')}`);
      return;
    }

    if (!confirm('Are you sure you want to submit your votes? This action cannot be undone.')) {
      return;
    }

    setSubmitting(true);
    try {
      const voteData = Object.entries(votes).map(([positionId, candidateId]) => ({
        positionId,
        candidateId,
      }));

      await votesAPI.castVote(ballotToken, voteData);
      toast.success('Vote cast successfully! Thank you for voting.');
      localStorage.removeItem('ballotToken');

      setTimeout(() => {
        navigate('/verify', { state: { message: 'Your vote has been recorded. Thank you!' } });
      }, 2000);
    } catch (err: any) {
      if (err.response?.status === 400) {
        const errorData = err.response?.data;
        if (errorData?.error?.includes('already used')) {
          toast.error('This ballot has already been used. You can only vote once.');
          localStorage.removeItem('ballotToken');
          navigate('/verify');
        } else if (errorData?.error?.includes('not open for voting')) {
          const closedPositions = errorData.closedPositions || [];
          if (closedPositions.length > 0) {
            toast.error(
              `Voting window closed for: ${closedPositions.map((p: any) => p.name).join(', ')}. Contact administrator to extend voting time.`,
              { duration: 8000 }
            );
          } else {
            toast.error(errorData.error + '. ' + (errorData.hint || ''), { duration: 8000 });
          }
        } else {
          toast.error(errorData?.error || 'Failed to cast vote', { duration: 5000 });
        }
      } else {
        toast.error(err.response?.data?.error || 'Failed to cast vote');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-card-stroke rounded-full border-t-primary animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-foreground">Loading your ballot...</p>
        </div>
      </div>
    );
  }

  if (!ballotData || ballotData.positions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <Card className="w-full max-w-md border-2 border-card-stroke">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Active Elections</h2>
            <p className="text-muted-foreground mb-6">There are no positions currently open for voting.</p>
            <Button
              onClick={() => navigate('/verify')}
            >
              Back to Verification
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = calculateProgress();
  const votedCount = Object.keys(votes).length;
  const totalPositions = ballotData.positions.length;
  const currentPosition = ballotData.positions[currentStep];

  const handleNext = () => {
    if (currentStep < ballotData.positions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const positionCandidates = ballotData.candidates.filter(
    (c) => c.position.id === currentPosition?.id
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-surface border-b border-card-stroke shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" showText={true} />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="text-lg font-bold text-primary">{votedCount}/{totalPositions}</p>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-primary-light"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 0.45}`}
                    strokeDashoffset={`${2 * Math.PI * 0.45 * (1 - progress / 100)}`}
                    className="text-primary transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-primary-light border-b border-card-stroke">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {ballotData.positions.map((position, index) => {
              const isActive = index === currentStep;
              const isVoted = !!votes[position.id];
              const isCompleted = index < currentStep;

              return (
                <button
                  key={position.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 min-w-[80px] transition-all ${isActive ? 'scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${isActive
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary-light'
                        : isVoted
                          ? 'bg-primary-light text-primary-dark'
                          : isCompleted
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-surface border-2 border-card-stroke text-disabled'
                      }`}
                  >
                    {isVoted ? '✓' : index + 1}
                  </div>
                  <p className={`text-xs font-medium text-center ${isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                    {position.name.split(' ')[0]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Voting Area - Step by Step */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentPosition && (
          <div className="space-y-6">
            {/* Position Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {currentPosition.name}
              </h2>
              <p className="text-muted-foreground">Step {currentStep + 1} of {totalPositions}</p>
            </div>

            {/* Candidates Grid */}
            {positionCandidates.length === 0 ? (
              <Card className="border-2 border-card-stroke text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No approved candidates for this position</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {positionCandidates.map((candidate) => {
                  const isSelected = votes[currentPosition.id] === candidate.id;

                  return (
                    <button
                      key={candidate.id}
                      onClick={() => handleVoteChange(currentPosition.id, candidate.id)}
                      className={`relative p-6 rounded-2xl border-2 transition-all text-left ${isSelected
                          ? 'border-primary bg-primary-light shadow-lg scale-[1.02]'
                          : 'border-card-stroke bg-surface hover:border-primary/50 hover:shadow-md'
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        {candidate.photoUrl ? (
                          <img
                            src={getFileUrl(candidate.photoUrl) || ''}
                            alt={candidate.name}
                            className="w-20 h-20 rounded-xl object-cover border-2 border-card-stroke"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-xl">
                            {candidate.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-primary-dark' : 'text-foreground'
                            }`}>
                            {candidate.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{candidate.program}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-card-stroke">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="disabled:opacity-50"
              >
                Previous
              </Button>

              {currentStep < totalPositions - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!votes[currentPosition.id]}
                  className="disabled:opacity-50"
                >
                  Next Position
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || votedCount !== totalPositions}
                  className={`${votedCount === totalPositions
                      ? ''
                      : 'bg-disabled text-disabled cursor-not-allowed'
                    }`}
                >
                  {submitting ? 'Submitting...' : 'Submit Vote'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingPage;