import React, { useEffect, useState } from 'react';
import { useElectron } from '../hooks/use-electron';
import { useMobilePlatform } from '../hooks/use-mobile';

// Import your API
// import { exampleApi } from '../api/example';

// Import UI components
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

/**
 * PageTemplate - A template for creating new pages
 * 
 * This is a template for creating new pages in the app.
 * Duplicate this file and customize for each new page.
 * 
 * The template includes:
 * - Platform detection (Electron, mobile)
 * - Basic layout structure
 * - State management example
 * - API call example (commented out)
 */
export default function PageTemplate() {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Platform detection
  const { isElectron, appInfo } = useElectron();
  const { isCapacitor, isIOS, isAndroid, isWeb } = useMobilePlatform();

  // Effect to load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Example API call (uncomment and modify)
        // const response = await exampleApi.getAll();
        // if (response.error) {
        //   throw new Error(response.error.message);
        // }
        // setData(response.data);
        
        // Placeholder data
        setData({ message: 'Data loaded successfully!' });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Platform-specific rendering
  const renderPlatformInfo = () => {
    if (isElectron) {
      return (
        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded">
          <p>Running in Electron</p>
          {appInfo && (
            <div className="text-sm opacity-70">
              <p>App name: {appInfo.name}</p>
              <p>Version: {appInfo.version}</p>
              <p>Environment: {appInfo.environment}</p>
            </div>
          )}
        </div>
      );
    } else if (isCapacitor) {
      return (
        <div className="p-4 bg-green-50 dark:bg-green-900 rounded">
          <p>Running on Mobile</p>
          <div className="text-sm opacity-70">
            {isIOS && <p>Platform: iOS</p>}
            {isAndroid && <p>Platform: Android</p>}
          </div>
        </div>
      );
    } else {
      return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
          <p>Running in Web Browser</p>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Page Template</h1>
      
      {/* Platform info */}
      {renderPlatformInfo()}
      
      {/* Main content */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Content Section</CardTitle>
          <CardDescription>
            This is an example content section for your new page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900 p-4 rounded text-red-600 dark:text-red-200">
              Error: {error}
            </div>
          ) : (
            <div className="prose dark:prose-invert">
              <p>Your content goes here.</p>
              {data && (
                <pre className="rounded bg-gray-100 dark:bg-gray-800 p-4 overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="mr-2">Cancel</Button>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}