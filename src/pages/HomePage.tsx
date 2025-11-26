import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Logo from '../components/ui/Logo';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Professional Background Image with Parallax Effect */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80')`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center center',
          }}
        />
        {/* Professional Overlay - Subtle gradient for readability */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(135deg, rgba(246, 248, 251, 0.82) 0%, rgba(246, 248, 251, 0.78) 50%, rgba(246, 248, 251, 0.82) 100%)',
          }}
        />
        {/* Additional subtle overlay for depth */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-[#F6F8FB]/15" />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
          {/* Hero Section with Professional Spacing */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
            <div className="text-center mb-12 sm:mb-16 md:mb-20 max-w-4xl mx-auto">
              {/* Professional Logo */}
              <div className="mb-6 sm:mb-8 animate-fade-in-up flex justify-center" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <Logo size="lg" showText={false} className="animate-bounce-slow" />
              </div>
              
              {/* Animated Accent Line */}
              <div className="inline-block mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <div className="h-1 sm:h-2 w-16 sm:w-24 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full animate-scale-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }} />
              </div>
              
              {/* Animated Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight leading-tight animate-fade-in-up px-2" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                Welcome to{' '}
                <span 
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent inline-block"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'gradient-shift 3s ease-in-out infinite',
                  }}
                >
                  VoteSphere
                </span>
                <span className="inline-block ml-2 sm:ml-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl animate-bounce-slow" style={{ animationDelay: '0.8s' }}>
                  🗳️
                </span>
              </h1>
              
              {/* Animated Subtitle */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto animate-fade-in-up px-4" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                Select your role below to access the appropriate portal. Secure, transparent, and democratic voting system.
              </p>
            </div>

          {/* Professional Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20 max-w-7xl mx-auto">
            {/* Voters Card */}
            <Card className="group relative hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-green-200/50 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 via-emerald-600 to-green-600 text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-3">Voters</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Verify with your registration number and cast your vote securely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <Button
                  className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white font-bold h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  onClick={() => navigate('/verify')}
                >
                  Vote Now
                </Button>
                <p className="text-xs text-center text-muted-foreground px-2 leading-relaxed">
                  Use your registration number to verify and vote securely
                </p>
              </CardContent>
            </Card>

            {/* Candidates Card */}
            <Card className="group relative hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-purple-200/50 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-3">Candidates</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Register to submit nominations and track your campaign progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  onClick={() => navigate('/candidate/login')}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-semibold h-12 transition-all duration-300 rounded-xl"
                  onClick={() => navigate('/candidate/register')}
                >
                  Register
                </Button>
                <p className="text-xs text-center text-muted-foreground px-2 leading-relaxed">
                  New candidates must register first to submit nominations
                </p>
              </CardContent>
            </Card>

            {/* Returning Officer Card */}
            <Card className="group relative hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-orange-200/50 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 via-amber-600 to-orange-600 text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-3">Returning Officer</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Review and approve candidate nominations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <Button
                  className="w-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:via-amber-700 hover:to-orange-700 text-white font-bold h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  onClick={() => navigate('/admin/login')}
                >
                  Officer Login
                </Button>
                <p className="text-xs text-center text-muted-foreground px-2 leading-relaxed">
                  Shared login for administrators and returning officers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Professional "How It Works" Section */}
          <div className="mt-24 md:mt-32 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10 md:p-16 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold">1</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Voters</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enter your registration number, verify with OTP sent to your email, then cast your vote securely
                </p>
              </div>
              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold">2</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Candidates</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Register your account, submit nominations during the nomination period, and track approval status
                </p>
              </div>
              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold">3</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Officials</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Administrators manage positions and voters. Officers review and approve candidate nominations
                </p>
              </div>
            </div>
          </div>

          {/* Professional Footer */}
          <div className="mt-20 text-center">
            <div className="inline-block mb-4">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-2">
              VoteSphere © 2025 | Secure Digital Voting Platform
            </p>
            <p className="text-xs text-muted-foreground">
              Secure • Transparent • Democratic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
