import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { reportsAPI } from '../../services/api';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getFileUrl } from '../../lib/imageUtils';

interface TurnoutData {
  totalVoters: number;
  votesCast: number;
  nonVoters: number;
  turnout: number;
  nonVoterPercentage: number;
}

interface CandidateResult {
  candidateId: string;
  name: string;
  program: string;
  photoUrl: string | null;
  votes: number;
  rank: number;
  votePercentage: number;
  isWinner: boolean;
}

interface PositionResult {
  positionId: string;
  positionName: string;
  seats: number;
  totalVotes: number;
  candidates: CandidateResult[];
}

interface ResultsData {
  positions: PositionResult[];
}

const COLORS = {
  primary: '#EC4899',
  secondary: '#F472B6',
  success: '#10B981',
  danger: '#EF4444',
  gray: '#9CA3AF',
};

const ReportsDashboard: React.FC = () => {
  const [turnoutData, setTurnoutData] = useState<TurnoutData | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [turnout, results] = await Promise.all([
        reportsAPI.getTurnout(),
        reportsAPI.getResults(),
      ]);
      setTurnoutData(turnout);
      setResultsData(results);
      // Auto-select first position
      if (results.positions && results.positions.length > 0) {
        setSelectedPosition(results.positions[0].positionId);
      }
    } catch (err: any) {
      console.error('Failed to load reports:', err);
      toast.error(err.response?.data?.error || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const selectedPositionData = resultsData?.positions.find(
    (p) => p.positionId === selectedPosition
  );

  // Prepare line chart data with candidates and "Not Voted"
  const lineChartData = selectedPositionData && turnoutData
    ? [
        ...selectedPositionData.candidates.map((candidate) => ({
          name: candidate.name.length > 15 
            ? candidate.name.substring(0, 15) + '...' 
            : candidate.name,
          fullName: candidate.name,
          votes: candidate.votes,
          percentage: candidate.votePercentage,
          isWinner: candidate.isWinner,
          photoUrl: candidate.photoUrl,
        })),
        {
          name: 'Not Voted',
          fullName: 'Not Voted',
          votes: turnoutData.nonVoters,
          percentage: turnoutData.nonVoterPercentage,
          isWinner: false,
          photoUrl: null,
        },
      ]
    : [];

  // Prepare line chart data with candidate photos for display
  const candidatesWithPhotosData = selectedPositionData
    ? selectedPositionData.candidates.map((candidate) => ({
        name: candidate.name.length > 15 
          ? candidate.name.substring(0, 15) + '...' 
          : candidate.name,
        fullName: candidate.name,
        votes: candidate.votes,
        percentage: candidate.votePercentage,
        isWinner: candidate.isWinner,
        photoUrl: candidate.photoUrl,
      }))
    : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface p-4 border-2 border-card-stroke rounded-xl shadow-xl">
          <p className="font-bold text-foreground mb-2">{data.fullName}</p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Votes:</span> {data.votes.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Percentage:</span> {data.percentage.toFixed(2)}%
          </p>
          {data.isWinner && (
            <p className="text-sm text-primary font-semibold mt-1">🏆 Winner</p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, payload } = props;
    const data = payload.payload;
    
    if (data.name === 'Not Voted') {
      return (
        <text x={x} y={y} dy={-10} fill={COLORS.danger} fontSize={12} fontWeight="bold" textAnchor="middle">
          {data.name}
        </text>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-2xl shadow-lg p-6 border-2 border-card-stroke">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Election <span className="text-primary">Results</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            View candidate performance and voting statistics
          </p>
        </div>
      </div>

      {resultsData && resultsData.positions.length > 0 && (
        <>
          {/* Position Selection */}
          <Card className="border-2 border-card-stroke shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Select Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {resultsData.positions.map((position) => (
                  <Button
                    key={position.positionId}
                    variant={selectedPosition === position.positionId ? 'default' : 'outline'}
                    onClick={() => setSelectedPosition(position.positionId)}
                    className="transition-all duration-200"
                  >
                    {position.positionName}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Line Chart with Candidates and Not Voted */}
          {selectedPositionData && lineChartData.length > 0 && (
            <Card className="border-2 border-card-stroke shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  {selectedPositionData.positionName} - Votes & Percentage
                </CardTitle>
                <CardDescription>
                  Candidate performance with votes cast and percentage, including not voted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FCE7F3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="votes"
                      orientation="left"
                      tick={{ fill: '#6B7280' }}
                      label={{ value: 'Votes', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                    />
                    <YAxis
                      yAxisId="percentage"
                      orientation="right"
                      tick={{ fill: '#6B7280' }}
                      label={{ value: 'Percentage (%)', angle: 90, position: 'insideRight', fill: '#6B7280' }}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="votes"
                      type="monotone"
                      dataKey="votes"
                      stroke={COLORS.primary}
                      strokeWidth={3}
                      dot={{ r: 6, fill: COLORS.primary }}
                      activeDot={{ r: 8 }}
                      name="Votes"
                    />
                    <Line
                      yAxisId="percentage"
                      type="monotone"
                      dataKey="percentage"
                      stroke={COLORS.success}
                      strokeWidth={3}
                      dot={{ r: 6, fill: COLORS.success }}
                      activeDot={{ r: 8 }}
                      name="Percentage (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Line Chart with Candidate Photos */}
          {selectedPositionData && candidatesWithPhotosData.length > 0 && (
            <Card className="border-2 border-card-stroke shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  {selectedPositionData.positionName} - Candidates with Photos
                </CardTitle>
                <CardDescription>
                  Visual representation of candidates with their photos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart data={candidatesWithPhotosData} margin={{ top: 60, right: 30, left: 20, bottom: 120 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FCE7F3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={140}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fill: '#6B7280' }}
                      label={{ value: 'Votes', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-surface p-4 border-2 border-card-stroke rounded-xl shadow-xl">
                              {data.photoUrl && (
                                <img
                                  src={getFileUrl(data.photoUrl) || ''}
                                  alt={data.fullName}
                                  className="w-20 h-20 object-cover rounded-lg mb-2 border-2 border-card-stroke"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <p className="font-bold text-gray-900 mb-1">{data.fullName}</p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Votes:</span> {data.votes.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Percentage:</span> {data.percentage.toFixed(2)}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="votes"
                      stroke={COLORS.primary}
                      strokeWidth={4}
                      dot={{ r: 8, fill: COLORS.primary, stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 12 }}
                      name="Votes"
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Candidate Photos Grid Below Chart */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {candidatesWithPhotosData.map((candidate, index) => (
                    <div
                      key={candidate.candidateId || index}
                      className={`text-center p-3 rounded-xl border-2 transition-all duration-300 ${
                        candidate.isWinner
                          ? 'border-primary bg-primary-light shadow-md'
                          : 'border-card-stroke bg-surface hover:shadow-md'
                      }`}
                    >
                      {candidate.photoUrl ? (
                        <img
                          src={getFileUrl(candidate.photoUrl) || ''}
                          alt={candidate.fullName}
                          className="w-20 h-20 mx-auto mb-2 object-cover rounded-full border-2 border-primary/30 shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) {
                              placeholder.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-20 h-20 mx-auto mb-2 rounded-full border-2 border-primary/30 shadow-sm bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground font-bold text-xl ${
                          candidate.photoUrl ? 'hidden' : 'flex'
                        }`}
                      >
                        {candidate.fullName.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-xs font-semibold text-gray-900 truncate mb-1">
                        {candidate.fullName}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        {candidate.votes.toLocaleString()} votes
                      </p>
                      <p className="text-xs font-semibold text-primary">
                        {candidate.percentage.toFixed(1)}%
                      </p>
                      {candidate.isWinner && (
                        <p className="text-xs text-primary font-bold mt-1">🏆 Winner</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!loading && (!resultsData || resultsData.positions.length === 0) && (
        <Card className="border-2 border-card-stroke shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-gray-600">No election results available yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsDashboard;
