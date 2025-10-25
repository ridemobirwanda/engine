import { Loader2 } from 'lucide-react';

// Optimized loading component with minimal re-renders
export const DelayedLoader = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

// Fast loading component for admin routes
export const AdminLoader = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading admin panel...</p>
      </div>
    </div>
  );
};

