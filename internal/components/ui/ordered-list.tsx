import { cn } from "@stytch-all-examples/internal/lib/utils";

export function OrderedList({
  className,
  items,
}: {
  className?: string;
  items: React.ReactNode[];
}) {
  return (
    <ol
      className={cn("list-decimal pl-4 space-y-3 ml-4 text-body1", className)}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
}
