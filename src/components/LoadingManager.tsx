import { ReactNode } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoadingManagerProps {
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
  children: ReactNode;
  loadingMessage?: string;
  errorTitle?: string;
  retryCount?: number;
  maxRetries?: number;
}

export const LoadingManager = ({
  isLoading,
  error,
  onRetry,
  onCancel,
  children,
  loadingMessage = "Loading...",
  errorTitle = "Something went wrong",
  retryCount = 0,
  maxRetries = 3
}: LoadingManagerProps) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">{loadingMessage}</p>
          {retryCount > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Retry attempt: {retryCount}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <CardTitle className="text-xl">{errorTitle}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            
            <div className="space-y-2">
              {onRetry && retryCount < maxRetries && (
                <Button 
                  onClick={onRetry}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
              
              {onCancel && (
                <Button 
                  variant="outline"
                  onClick={onCancel}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </div>
            
            {retryCount >= maxRetries && (
              <p className="text-xs text-muted-foreground">
                Maximum retry attempts reached. Please refresh the page or contact support.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show children when not loading and no error
  return <>{children}</>;
};

