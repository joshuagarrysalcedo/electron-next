'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  Server, 
  Globe,
  ChevronRight, 
  ChevronDown
} from 'lucide-react';

/**
 * NavItem - Represents a navigation item in the sidebar
 */
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  requiredRole?: 'admin' | 'user' | null;
}

/**
 * NavSection - Represents a section of navigation items in the sidebar
 */
export interface NavSection {
  title: string;
  items: NavItem[];
  requiredRole?: 'admin' | 'user' | null;
  defaultOpen?: boolean;
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
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  
  // Initialize open sections based on defaultOpen or if the section contains the current path
  React.useEffect(() => {
    const initialOpenSections = sections
      .filter(section => 
        section.defaultOpen || 
        section.items.some(item => pathname === item.href || pathname?.startsWith(item.href + '/'))
      )
      .map(section => section.title);
    
    setOpenSections(initialOpenSections);
  }, [sections, pathname]);
  
  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(s => s !== title) 
        : [...prev, title]
    );
  };
  
  // Filter sections based on user role
  const filteredSections = sections.filter(section => {
    if (!section.requiredRole) return true;
    if (section.requiredRole === 'admin' && user?.role === 'admin') return true;
    if (section.requiredRole === 'user' && user) return true;
    return false;
  });
  
  // Get icon component for nav item
  const getIcon = (item: NavItem) => {
    if (item.icon) {
      return <span className="mr-2">{item.icon}</span>;
    }
    
    // Default icons based on title
    const title = item.title.toLowerCase();
    if (title.includes('dashboard')) return <LayoutDashboard className="h-4 w-4 mr-2" />;
    if (title.includes('documentation') || title.includes('docs')) return <FileText className="h-4 w-4 mr-2" />;
    if (title.includes('settings')) return <Settings className="h-4 w-4 mr-2" />;
    if (title.includes('user')) return <Users className="h-4 w-4 mr-2" />;
    if (title.includes('service')) return <Server className="h-4 w-4 mr-2" />;
    if (title.includes('wikipedia')) return <Globe className="h-4 w-4 mr-2" />;
    
    return null;
  };

  return (
    <div className={cn('pb-12', className)} {...props}>
      <div className="space-y-4 py-4">
        {filteredSections.map((section, i) => {
          const isOpen = openSections.includes(section.title);
          
          // Filter items based on user role
          const filteredItems = section.items.filter(item => {
            if (!item.requiredRole) return true;
            if (item.requiredRole === 'admin' && user?.role === 'admin') return true;
            if (item.requiredRole === 'user' && user) return true;
            return false;
          });
          
          if (filteredItems.length === 0) return null;
          
          return (
            <div key={i} className="px-3 py-2">
              <div
                className="flex items-center justify-between mb-2 px-4 text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                onClick={() => toggleSection(section.title)}
              >
                <h2 className="font-semibold tracking-tight">
                  {section.title}
                </h2>
                <div className="text-muted-foreground">
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>
              
              {isOpen && (
                <div className="space-y-1">
                  {filteredItems.map((item, j) => {
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
                          {getIcon(item)}
                          {!collapsed && item.title}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}