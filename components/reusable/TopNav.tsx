'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

/**
 * TopNavProps - Props for the TopNav component
 */
export interface TopNavProps extends React.HTMLAttributes<HTMLDivElement> {
  showUserMenu?: boolean;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * TopNav - A reusable top navigation component
 * 
 * @author Joshua Salcedo
 */
export function TopNav({
  showUserMenu = true,
  logo,
  actions,
  className,
  ...props
}: TopNavProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    
    return nameParts[0][0];
  };

  return (
    <div
      className={cn(
        'border-b bg-background h-16 flex items-center px-4',
        className
      )}
      {...props}
    >
      {/* Logo area */}
      <div className="flex items-center">
        {logo}
      </div>
      
      {/* Actions area - center */}
      <div className="flex-1 flex justify-center">
        {actions}
      </div>
      
      {/* User menu area */}
      {showUserMenu && user && (
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-muted-foreground">{user.email}</span>
                  <span className="text-xs mt-1 font-medium">
                    Role: {user.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}