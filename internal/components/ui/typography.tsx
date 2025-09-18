import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@stytch-all-examples/internal/lib/utils";

const typographyVariants = cva("font-default", {
  variants: {
    variant: {
      h1: "text-h1 font-semibold tracking-normal",
      h2: "text-h2 font-semibold tracking-normal",
      h3: "text-h3 font-semibold tracking-normal",
      h4: "text-h4 tracking-normal",
      body1: "text-body1 tracking-normal",
      body2: "text-body2 tracking-normal",
      error: "text-body1 tracking-normal text-red-500",
    },
  },
  defaultVariants: {
    variant: "body1",
  },
});

interface TypographyProps extends VariantProps<typeof typographyVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  children: React.ReactNode;
}

function Typography({
  as,
  variant,
  className,
  children,
  ...props
}: TypographyProps & React.ComponentProps<"div">) {
  // Auto-map variant to HTML element if 'as' prop is not provided
  const getDefaultElement = (variant: string | null | undefined) => {
    if (!variant) return "p";

    const elementMap = {
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      body1: "p",
      body2: "p",
      error: "p",
    };

    return elementMap[variant as keyof typeof elementMap] || "p";
  };

  const Component = as || getDefaultElement(variant);

  return React.createElement(
    Component,
    {
      className: cn(typographyVariants({ variant }), className),
      ...props,
    },
    children
  );
}

export { Typography, typographyVariants };
