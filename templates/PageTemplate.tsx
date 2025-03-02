'use client';

import React from 'react';
import { Dashboard } from '@/components/reusable/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

/**
 * PageTemplate - A template for creating new pages in the app
 * 
 * @author Joshua Salcedo
 */
export default function PageTemplate() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  return (
    <Dashboard 
      requireAuth={true} // Set to false if public access is needed
      requiredRole={null} // Set to 'admin' if admin access is required
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
            <p className="text-muted-foreground">
              Page description goes here
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Action Button</Button>
            <Button>Primary Action</Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                Card description goes here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This is the main content of the card. You can put any content here.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Card Action <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>
                Another card description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This is another card. You can add as many as you need.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Secondary Action <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Example of conditional content based on user role */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Admin-Only Content</CardTitle>
              <CardDescription>
                This content is only visible to administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This card is only shown to users with the admin role.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Dashboard>
  );
}