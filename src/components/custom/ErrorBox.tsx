import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ErrorBoxProps {
  error?: string;
  className?: string;
}

export const ErrorBox = ({ error, className }: ErrorBoxProps) => {
  return (
    <Alert variant="destructive" className={`${className}`}>
      <AlertDescription>{error || "An error occurred."}</AlertDescription>
    </Alert>
  );
};
