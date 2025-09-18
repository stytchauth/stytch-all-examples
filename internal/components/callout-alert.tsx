import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@stytch-all-examples/internal/components/ui/alert";

interface CalloutAlertProps {
  title: string;
  description: React.ReactNode;
}

export function CalloutAlert({ title, description }: CalloutAlertProps) {
  return (
    <Alert className="bg-code">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
