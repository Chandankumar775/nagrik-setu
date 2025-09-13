import { getReports } from '@/app/actions';
import { AdminDashboard } from '@/components/citizen-connect/AdminDashboard';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function AdminPage() {
  const reports = await getReports();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
        <AdminDashboard reports={reports} />
    </Suspense>
  );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <Skeleton className="h-[500px] lg:col-span-3" />
                <Skeleton className="h-[300px] lg:h-[500px] lg:col-span-2" />
            </div>
        </div>
    )
}
