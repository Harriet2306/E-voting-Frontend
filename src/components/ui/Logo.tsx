import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Original Logo Design - Scales/Justice Theme */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-md transform rotate-12 opacity-90" />
        <div className="relative w-full h-full bg-background rounded-md flex items-center justify-center border-2 border-primary/30">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-3/4 h-3/4 text-primary"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Scales of Justice */}
            <path d="M12 2v20M8 6h8M6 10h12M4 14h16M2 18h20" />
            <circle cx="12" cy="8" r="2" />
            <circle cx="12" cy="16" r="2" />
          </svg>
        </div>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-tighter bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent`}>
          FAIR CAST
        </span>
      )}
    </div>
  );
};

export default Logo;
