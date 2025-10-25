import { memo, Suspense, lazy } from 'react';
import { AdminHeader } from './AdminHeader';
import { PerformanceLoader } from './PerformanceLoader';

// Lazy load heavy admin components
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

export const AdminDashboardOptimized = memo(() => {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<PerformanceLoader count={4} />}>
          <AdminDashboard />
        </Suspense>
      </main>
    </div>
  );
});

AdminDashboardOptimized.displayName = 'AdminDashboardOptimized';



