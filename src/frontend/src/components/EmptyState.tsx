import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <Alert className="max-w-2xl">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          {description}
        </AlertDescription>
      </Alert>
    </div>
  );
}
