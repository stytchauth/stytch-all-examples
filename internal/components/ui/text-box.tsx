import { Typography } from "@stytch-all-examples/internal/components/ui/typography";
import { cn } from "@stytch-all-examples/internal/lib/utils";
import { cubicBezier, motion } from "framer-motion";
import React from "react";

interface TextBoxProps {
  className?: string;
  title: string;
  children: React.ReactNode;
}

export function TextBox({ className, title, children }: TextBoxProps) {
  return (
    <motion.div
      className={cn("flex flex-col gap-4 min-w-md", className)}
      initial={{ opacity: 0, scale: 1, rotate: 0, y: 0, filter: "blur(2px)" }}
      animate={{ opacity: 1, scale: 1, rotate: 0, y: 0, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        scale: 1,
        rotate: 0,
        y: 0,
        filter: "blur(2px)",
      }}
      transition={{
        duration: 1.5,
        ease: cubicBezier(0.85, 0, 0.15, 1),
      }}
    >
      <Typography variant="h1" className="pb-4 tracking-wide">
        {title}
      </Typography>
      {children}
    </motion.div>
  );
}
