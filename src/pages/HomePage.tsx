import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Logo from '../components/ui/Logo';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mouse position effect remains for background animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${100 - mousePosition.x * 0.03}%`,
            top: `${100 - mousePosition.y * 0.03}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-50 border-b border-card-stroke bg-surface/80 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" showText={true} />
            <div className="hidden md:flex items-center gap-8">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="ml-4"
              >
                Go to Login
              </Button>
            </div>
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Single Login Entry Point */}
      <section className="relative z-10 container mx-auto px-6 flex-grow flex items-center justify-center">
        <div className="max-w-5xl mx-auto grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-center">
          {/* Text side */}
          <div className="text-left space-y-8">


            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in-up">
              <span className="block mb-2">Login into</span>
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                FAIRCAST Vote
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              One secure portal for voters, administrators, officers, and candidates.
              Choose your role and access the tools designed for you.
            </p>
          </div>

          {/* Single Login Card */}
          <div className="max-w-md w-full mx-auto">
            <Card className="group relative overflow-hidden border-2 border-card-stroke hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform mx-auto">
                  🔐
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground text-center">
                  Login into FAIRCAST
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-center">
                  Access your FAIRCAST account as a voter, admin, officer, or candidate from a single secure login page.
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full"
                  size="lg"
                >
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-surface border-t border-card-stroke py-12">
        <div className="w-full px-8 md:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
            <Logo size="sm" showText={true} className="justify-center" />
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <span>© 2025 Fair Cast</span>
              <span className="hidden md:inline">•</span>
              <span>Secure • Transparent • Democratic</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
