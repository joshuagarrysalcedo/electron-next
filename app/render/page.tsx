'use client';

export const dynamic = 'force-static';

import React, { useState } from 'react';
import { Dashboard } from '@/components/reusable/Dashboard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderIcon, SearchIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * RenderPage - Component to render Wikipedia content
 * 
 * @author Joshua Salcedo
 */
export default function RenderPage() {
  const [url, setUrl] = useState<string>('https://en.wikipedia.org/wiki/Main_Page');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { user } = useAuth();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    // Format Wikipedia search URL
    const searchUrl = `https://en.wikipedia.org/wiki/${searchQuery.replace(/ /g, '_')}`;
    setUrl(searchUrl);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleGoToMainPage = () => {
    setLoading(true);
    setUrl('https://en.wikipedia.org/wiki/Main_Page');
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <Dashboard
      hideSidebar={false}
      requireAuth={true}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wikipedia Viewer</h1>
            <p className="text-muted-foreground">
              {getGreeting()}, {user?.name}. Browse Wikipedia content within the app.
            </p>
          </div>
        </div>
        
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Search Wikipedia</CardTitle>
                  <CardDescription>
                    Enter a topic to search Wikipedia
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGoToMainPage}
                  disabled={loading}
                >
                  Main Page
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  placeholder="Enter a topic to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !searchQuery.trim()}>
                  {loading ? (
                    <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <SearchIcon className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Wikipedia Content</CardTitle>
              <CardDescription>
                {loading ? 'Loading content...' : url}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100vh-350px)] min-h-[500px] p-0">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <iframe
                  src={url}
                  className="w-full h-full border-0"
                  title="Wikipedia Content"
                />
              )}
            </CardContent>
            <CardFooter className="border-t p-3 text-xs text-muted-foreground">
              Content displayed from Wikipedia is subject to Wikipedia's terms of use.
            </CardFooter>
          </Card>
        </div>
      </div>
    </Dashboard>
  );
}