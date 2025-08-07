import { Typography } from "@stytch-all-examples/internal/components/ui/typography";
import { cn } from "@stytch-all-examples/internal/lib/utils";
import React from "react";

interface TextBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  title: string;
  children: React.ReactNode;
}

export function TextBox({
  className,
  title,
  children,
  ...props
}: TextBoxProps) {
  return (
    <div className={cn("flex flex-col gap-4 min-w-md", className)} {...props}>
      <Typography variant="h1" className="pb-4 tracking-wide">
        {title}
      </Typography>
      {children}
    </div>
  );
}
