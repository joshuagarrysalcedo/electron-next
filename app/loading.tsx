import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4 p-8">
      <div className="space-y-2">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-32 rounded-md" />
        <Skeleton className="h-32 rounded-md" />
        <Skeleton className="h-32 rounded-md" />
      </div>
    </div>
  );
}