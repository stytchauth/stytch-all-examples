import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Link } from "./link";

interface ErrorBoxProps {
  title: string;
  error: string;
  redirectUrl?: string;
  redirectText?: string;
}

export function ErrorBox({
  title,
  error,
  redirectUrl,
  redirectText,
}: ErrorBoxProps) {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {error}
        {redirectUrl && redirectText && (
          <Link href={redirectUrl} text={redirectText} />
        )}
      </AlertDescription>
    </Alert>
  );
}
