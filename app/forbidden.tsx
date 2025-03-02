import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Alert variant="destructive" className="max-w-md mb-6">
        <ShieldAlert className="h-6 w-6 mr-2" />
        <AlertTitle className="text-3xl font-bold mb-2">403 - Access Forbidden</AlertTitle>
        <AlertDescription className="text-lg">
          You don't have permission to access this resource.
        </AlertDescription>
      </Alert>
      
      <Button asChild variant="default">
        <Link href="/">
          Return to Safety
        </Link>
      </Button>
    </div>
  );
}