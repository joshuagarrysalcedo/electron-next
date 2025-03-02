import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

/**
 * AuthCard - A styled card component for auth forms
 * 
 * @author Joshua Salcedo
 */
interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className = '',
}: AuthCardProps) {
  return (
    <Card className={`w-full max-w-md mx-auto shadow-lg ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        {description && (
          <CardDescription className="text-center">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}