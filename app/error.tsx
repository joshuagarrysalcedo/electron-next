'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optional: Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Alert variant="destructive" className="max-w-md mb-6">
        <AlertTriangle className="h-6 w-6 mr-2" />
        <AlertTitle className="text-xl font-bold mb-2">Something went wrong!</AlertTitle>
        <AlertDescription>
          {process.env.NODE_ENV === 'development' ? (
            <div className="mt-2 text-sm font-mono bg-gray-100 p-3 rounded overflow-auto max-h-60">
              {error.message}
            </div>
          ) : (
            'An unexpected error occurred. Please try again later.'
          )}
        </AlertDescription>
      </Alert>

      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Button asChild variant="default">
          <a href="/">Go Home</a>
        </Button>
      </div>
    </div>
  );
}