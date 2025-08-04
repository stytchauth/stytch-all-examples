import { cn } from "@stytch-all-examples/internal/lib/utils";

export function List({
  className,
  items,
}: {
  items: React.ReactNode[];
  className?: string;
}) {
  return (
    <ul className={cn("list-disc pl-4 space-y-1 ml-4", className)}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
