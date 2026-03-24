import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const { profile, signOut } = useAuth(); // use signOut for logout
  const navigate = useNavigate();
  const location = useLocation();

  // Dropdown state
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Shorten user ID
  const shortUserId = profile?.user_id
    ? profile.user_id.slice(0, Math.ceil(profile.user_id.length / 2)) + '...'
    : '---';

  // Live balance (or price) state
  const [liveBalance, setLiveBalance] = useState(profile?.balance ?? 0);

  // Update balance whenever profile changes
  useEffect(() => {
    if (profile?.balance != null) {
      setLiveBalance(profile.balance);
    }
  }, [profile?.balance]);

  // Detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <header className="h-14 flex items-center justify-between border-b border-border px-4">

            {/* Left */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-foreground" />
              <img
                src="./logo.png"
                alt="AmbrePay Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">

              {/* Home */}
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex items-center gap-1 text-primary hover:text-primary/80 transition"
              >
                <Home className="h-5 w-5" />
              </button>

              {/* Back */}
              {location.pathname !== '/dashboard' && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}

              {/* ID + Live Balance */}
              {!isMobile && (
                <span className="text-sm text-muted-foreground">
                  ID: {shortUserId} • Balance: KSH {Number(liveBalance).toLocaleString()}
                </span>
              )}

              {/* Avatar with Dropdown */}
              <div className="relative" ref={ref}>
                {/* Avatar */}
                <div
                  onClick={() => setOpen(!open)}
                  className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold cursor-pointer"
                >
                  {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                    {/* Name */}
                    <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                      {profile?.full_name || 'User'}
                    </div>

                    {/* Logout */}
                    <button
                      onClick={signOut} // works like sidebar
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-secondary transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

            </div>
          </header>

          {/* Main */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;