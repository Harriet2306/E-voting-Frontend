import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authAPI } from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Logo from '../ui/Logo';
import RegisterCandidate from '../candidates/RegisterCandidate';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  role?: 'ADMIN' | 'OFFICER' | 'CANDIDATE';
  title?: string;
  subtitle?: string;
}

const Login: React.FC<LoginProps> = ({
  role,
  title = 'Login into FAIRCAST Vote',
  subtitle = 'Enter your credentials to access your portal'
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'OFFICER' | 'CANDIDATE' | 'VOTER' | ''>(role ?? '');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(data.email, data.password);

      // Store token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Show welcome message
      const userName = response.user.name || response.user.email.split('@')[0];
      const welcomeEmoji = response.user.role === 'ADMIN' ? '👑' : response.user.role === 'OFFICER' ? '📋' : '🎯';

      localStorage.setItem('welcomeMessage', JSON.stringify({
        message: `Welcome back, ${userName}! ${welcomeEmoji}`,
        timestamp: Date.now()
      }));

      // Route based on role
      const userRole = response.user.role;
      switch (userRole) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'OFFICER':
          navigate('/officer/dashboard');
          break;
        case 'CANDIDATE':
          navigate('/candidate/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      let errorMessage = 'Login failed. Please try again.';

      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (err.response?.status === 401) {
        errorMessage = err.response?.data?.error || 'Invalid email or password.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = () => {
    const effectiveRole = selectedRole || role;

    switch (effectiveRole) {
      case 'ADMIN':
        return {
          icon: '👑',
          gradient: 'from-primary to-primary-dark',
          description: 'Administrator access to manage elections'
        };
      case 'OFFICER':
        return {
          icon: '📋',
          gradient: 'from-secondary to-secondary-dark',
          description: 'Returning officer access to review nominations'
        };
      case 'CANDIDATE':
        return {
          icon: '🎯',
          gradient: 'from-accent-purple to-primary',
          description: 'Candidate access to manage your nominations'
        };
      case 'VOTER':
        return {
          icon: '🗳️',
          gradient: 'from-secondary to-primary',
          description: 'Verify your identity to cast your vote'
        };
      default:
        return {
          icon: '🔐',
          gradient: 'from-primary to-secondary',
          description: 'Sign in to access your account'
        };
    }
  };

  const roleInfo = getRoleInfo();



  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${roleInfo.gradient} rounded-full blur-3xl opacity-10 animate-pulse`} />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border-2 border-card-stroke shadow-2xl bg-surface/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center px-6 pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleInfo.gradient} flex items-center justify-center text-4xl shadow-lg`}>
                {roleInfo.icon}
              </div>
            </div>
            <div className="flex justify-center mb-2">
              <Logo size="sm" showText={true} />
            </div>
            <CardTitle className="text-3xl font-bold">{title}</CardTitle>
            <CardDescription className="text-base">
              {subtitle}
            </CardDescription>
            {(selectedRole || role) && (
              <p className="text-sm text-muted-foreground mt-2">
                {roleInfo.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <div className="space-y-4 mb-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="role" className="text-sm font-semibold">
                  Select your role
                </Label>
                <select
                  id="role"
                  className="w-full h-10 rounded-md border border-card-stroke bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  value={selectedRole}
                  disabled={loading}
                  onChange={(e) => {
                    const value = e.target.value as 'ADMIN' | 'OFFICER' | 'CANDIDATE' | 'VOTER' | '';
                    setSelectedRole(value);
                    setError('');

                    if (value === 'VOTER') {
                      // Voters use the verification flow instead of email/password login
                      navigate('/verify');
                    }
                  }}
                >
                  <option value="">Choose role…</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OFFICER">Officer</option>
                  <option value="CANDIDATE">Candidate</option>
                  <option value="VOTER">Voter</option>
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="p-4 text-sm text-error bg-error/10 border border-error/20 rounded-lg animate-slide-in-right">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={`h-12 ${errors.email ? 'border-error focus:ring-error/20' : 'border-card-stroke focus:border-primary'}`}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm text-error flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className={`h-12 ${errors.password ? 'border-error focus:ring-error/20' : 'border-card-stroke focus:border-primary'}`}
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-sm text-error flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={loading || !selectedRole || selectedRole === 'VOTER'}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-card-stroke">
              <div className="text-center space-y-3">
                {role === 'CANDIDATE' && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full font-semibold"
                    onClick={() => navigate('/candidate/register')}
                  >
                    Don't have an account? Register as Candidate
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/verify')}
                >
                  <span className="mr-2">🗳️</span>
                  I'm a Voter - Verify & Vote
                </Button>
                <div className="text-center">
                  <button
                    onClick={() => navigate('/')}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    ← Back to Home
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
