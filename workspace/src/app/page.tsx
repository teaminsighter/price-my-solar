
import { Suspense } from 'react';
import { HomePage } from '@/components/page/home-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex flex-col">
        <Skeleton className="h-[60vh] w-full" />
        <div className="container mx-auto py-12">
           <Skeleton className="h-96 w-full" />
        </div>
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}
