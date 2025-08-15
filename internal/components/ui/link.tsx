import { cn } from "@stytch-all-examples/internal/lib/utils";

export function Link({
  href,
  text,
  className,
}: {
  href: string;
  text: string;
  className?: string;
}) {
  return (
    <a className={cn("underline font-bold", className)} href={href}>
      {text}
    </a>
  );
}
