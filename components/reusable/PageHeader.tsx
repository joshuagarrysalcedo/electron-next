import React, { ReactNode } from 'react';

/**
 * PageHeader - A styled page header component
 * 
 * @author Joshua Salcedo
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 ${className}`}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 sm:mt-0 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}