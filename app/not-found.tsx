import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Alert className="max-w-md mb-6">
        <AlertTitle className="text-3xl font-bold mb-2">404 - Page Not Found</AlertTitle>
        <AlertDescription className="text-lg">
          The page you are looking for doesn't exist or has been moved.
        </AlertDescription>
      </Alert>
      
      <Button asChild variant="default">
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  );
}