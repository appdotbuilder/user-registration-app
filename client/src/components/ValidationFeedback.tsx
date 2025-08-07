import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ValidationFeedbackProps {
  isValid?: boolean;
  isLoading?: boolean;
  error?: string;
  successMessage?: string;
  warningMessage?: string;
}

export function ValidationFeedback({ 
  isValid, 
  isLoading, 
  error, 
  successMessage, 
  warningMessage 
}: ValidationFeedbackProps) {
  if (isLoading) {
    return (
      <Badge variant="secondary" className="text-xs animate-pulse">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1" />
        Checking...
      </Badge>
    );
  }

  if (error) {
    return (
      <Badge variant="destructive" className="text-xs badge-slide-in">
        <XCircle className="w-3 h-3 mr-1" />
        {error}
      </Badge>
    );
  }

  if (warningMessage) {
    return (
      <Badge className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100 badge-slide-in">
        <AlertCircle className="w-3 h-3 mr-1" />
        {warningMessage}
      </Badge>
    );
  }

  if (isValid && successMessage) {
    return (
      <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100 badge-slide-in">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        {successMessage}
      </Badge>
    );
  }

  return null;
}