import { memo } from 'react';
import { Loader2, Shield, Database, Users, Settings } from 'lucide-react';

export const AdminPreloader = memo(() => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto">
        {/* Logo/Icon */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Database className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Loading Admin Panel</h2>
          <p className="text-muted-foreground">Preparing your dashboard...</p>
        </div>

        {/* Loading spinner */}
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>

        {/* Progress indicators */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Loading user data...</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Database className="w-4 h-4" />
            <span>Connecting to database...</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Settings className="w-4 h-4" />
            <span>Initializing settings...</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>

        {/* Status text */}
        <p className="text-xs text-muted-foreground">
          This may take a few moments on first load...
        </p>
      </div>
    </div>
  );
});

AdminPreloader.displayName = 'AdminPreloader';



