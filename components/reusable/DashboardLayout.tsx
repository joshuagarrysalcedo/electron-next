import React, { ReactNode } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { HomeIcon, UsersIcon, ServerIcon, GlobeIcon, LogOutIcon, SettingsIcon } from 'lucide-react';

/**
 * DashboardLayout - A layout component for authenticated pages
 * 
 * @author Joshua Salcedo
 */
interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isAdmin = user?.role === 'admin';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5 mr-2" /> },
    { href: '/render', label: 'Wikipedia', icon: <GlobeIcon className="h-5 w-5 mr-2" /> },
  ];

  const adminNavItems = [
    { href: '/admin/users', label: 'Users', icon: <UsersIcon className="h-5 w-5 mr-2" /> },
    { href: '/admin/settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5 mr-2" /> },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <div className="flex flex-col h-full border-r bg-card">
          {/* Logo and branding */}
          <div className="p-4 border-b">
            <h1 className="font-bold text-xl">Electron Next App</h1>
            <p className="text-sm text-muted-foreground">
              v1.0.0
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {isAdmin && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin
                    </div>
                  </div>
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>

          {/* User info and logout */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOutIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between w-full p-4 border-b bg-card">
        <h1 className="font-bold text-xl">Electron Next App</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOutIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}