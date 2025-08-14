import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Link } from "./link";

interface ErrorBoxProps {
  title: string;
  error: string;
}

export function ErrorBox({ title, error }: ErrorBoxProps) {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {error}
        <Link href="/" text="Return to home" />
      </AlertDescription>
    </Alert>
  );
}
