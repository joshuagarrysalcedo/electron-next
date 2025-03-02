'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

/**
 * NavItem - Represents a navigation item in the sidebar
 */
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * NavSection - Represents a section of navigation items in the sidebar
 */
export interface NavSection {
  title: string;
  items: NavItem[];
  requiredRole?: 'admin' | 'user' | null;
}

/**
 * SidebarProps - Props for the Sidebar component
 */
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: NavSection[];
  collapsed?: boolean;
}

/**
 * Sidebar - A reusable sidebar component
 * 
 * @author Joshua Salcedo
 */
export function Sidebar({ 
  sections,
  collapsed = false,
  className,
  ...props
}: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Filter sections based on user role
  const filteredSections = sections.filter(section => {
    if (!section.requiredRole) return true;
    if (section.requiredRole === 'admin' && user?.role === 'admin') return true;
    if (section.requiredRole === 'user' && user) return true;
    return false;
  });

  return (
    <div className={cn('pb-12', className)} {...props}>
      <div className="space-y-4 py-4">
        {filteredSections.map((section, i) => (
          <div key={i} className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item, j) => {
                const isActive = pathname === item.href;
                
                return (
                  <Button
                    key={j}
                    asChild
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    disabled={item.disabled}
                  >
                    <Link href={item.disabled ? '#' : item.href}>
                      {item.icon && (
                        <span className="mr-2">{item.icon}</span>
                      )}
                      {!collapsed && item.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}