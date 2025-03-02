'use client';

import React, { useEffect } from 'react';
import { TopNav } from './TopNav';
import { Sidebar, NavSection } from './Sidebar';
import { useLayoutController } from '@/lib/layout-controller';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * DashboardProps - Props for the Dashboard component
 */
export interface DashboardProps {
  /**
   * Custom logo to display in the top navigation
   */
  logo?: React.ReactNode;
  
  /**
   * Navigation sections for the sidebar
   */
  sidebarSections?: NavSection[];
  
  /**
   * Whether to hide the sidebar
   */
  hideSidebar?: boolean;
  
  /**
   * Whether to show the top navigation
   */
  showTopNav?: boolean;
  
  /**
   * Custom actions for the top navigation
   */
  topNavActions?: React.ReactNode;
  
  /**
   * Custom class name for the dashboard
   */
  className?: string;
  
  /**
   * Whether to require authentication to access the dashboard
   */
  requireAuth?: boolean;
  
  /**
   * Required role to access the dashboard
   */
  requiredRole?: 'admin' | 'user' | null;
  
  /**
   * Optional children to render instead of the current view
   */
  children?: React.ReactNode;
  
  /**
   * Whether to render the children next to the current view
   */
  renderChildrenWithView?: boolean;
  
  /**
   * Path to redirect to if authentication is required but not provided
   */
  authRedirectPath?: string;
}

/**
 * Dashboard - A reusable dashboard component
 * 
 * @author Joshua Salcedo
 */
export function Dashboard({
  logo = <div className="text-xl font-bold">Electron Next</div>,
  sidebarSections = [],
  hideSidebar = false,
  showTopNav = true,
  topNavActions,
  className,
  requireAuth = true,
  requiredRole = null,
  children,
  renderChildrenWithView = false,
  authRedirectPath = '/login',
}: DashboardProps) {
  const { getCurrentView } = useLayoutController();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Default sidebar sections if none provided
  const defaultSidebarSections: NavSection[] = [
    {
      title: 'Menu',
      items: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Wikipedia', href: '/render' }
      ]
    },
    {
      title: 'Admin',
      items: [
        { title: 'Users', href: '/admin/users' },
        { title: 'Settings', href: '/admin/settings' }
      ],
      requiredRole: 'admin'
    }
  ];
  
  // Check if user is authenticated and has required role
  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push(authRedirectPath);
    }
    
    if (requiredRole === 'admin' && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, requiredRole, user, router, requireAuth, authRedirectPath]);
  
  // Get the current view component
  const currentView = getCurrentView();
  
  // Render the current view if it exists
  const renderCurrentView = () => {
    if (!currentView) return null;
    
    return React.createElement(currentView.component, currentView.props || {});
  };
  
  // Don't render anything if authentication is required but not provided
  if (requireAuth && !isAuthenticated) {
    return null;
  }
  
  // Don't render if admin role is required but user is not an admin
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return null;
  }
  
  return (
    <div className={cn('min-h-screen bg-background flex flex-col', className)}>
      {/* Top Navigation */}
      {showTopNav && (
        <TopNav 
          logo={logo} 
          actions={topNavActions}
        />
      )}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        {!hideSidebar && (
          <aside className="w-64 border-r hidden md:block">
            <Sidebar 
              sections={sidebarSections.length ? sidebarSections : defaultSidebarSections}
            />
          </aside>
        )}
        
        {/* Main Content */}
        <main className={cn('flex-1', hideSidebar ? 'w-full' : 'md:ml-64')}>
          <div className="p-6">
            {/* Render children if provided */}
            {children && !renderChildrenWithView && children}
            
            {/* Render current view if no children or renderChildrenWithView is true */}
            {(!children || renderChildrenWithView) && renderCurrentView()}
            
            {/* Render children alongside current view if renderChildrenWithView is true */}
            {children && renderChildrenWithView && children}
          </div>
        </main>
      </div>
    </div>
  );
}