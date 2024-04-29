"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xslate-7 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background active:scale-95 active:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary:
          "bg-xindigo-3 text-xindigo-11 hover:bg-xindigo-4 border-xindigo-7 border hover:border-xindigo-8",
        destructive:
          "bg-xred-3 text-xred-11 hover:bg-xred-4 border-xred-7 border hover:border-xred-8",
        success:
          "bg-xgreen-3 text-xgreen-11 hover:bg-xgreen-4 border-xgreen-7 border hover:border-xgreen-8",
        outline: "border border-xslate-7",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-xslate-3 hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-inherit",
        neutral:
          "bg-xslate-3 text-xslate-11 hover:bg-xslate-4 border-xslate-7 border hover:border-xslate-8",
      },
      size: {
        default: "h-10 py-2 px-4 text-sm",
        xs: "h-6 px-3 rounded-md text-xs",
        sm: "h-9 px-3 rounded-md text-sm",
        lg: "h-11 px-8 rounded-md text-sm",
        icon: "size-8 h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"; // eslint-disable-line
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
