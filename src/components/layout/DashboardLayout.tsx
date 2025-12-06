import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'ADMIN' | 'OFFICER' | 'CANDIDATE';
  title: string;
  subtitle?: string;
  onNavAction?: (action: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  title,
  subtitle,
  onNavAction,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onNavAction={onNavAction}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-20">
        {/* Top Bar */}
        <TopBar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
