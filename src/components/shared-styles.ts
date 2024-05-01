// Do not add a 'use client" comment to this file.
// This is meant to be able to be imported in both the client and server.

import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xslate-7 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background active:scale-95 active:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary:
          "bg-xamber-3 text-xamber-11 hover:bg-xamber-4 border-xamber-7 border hover:border-xamber-8",

        outline: "border",

        ghost: "hover:bg-xslate-3 hover:text-accent-foreground",
      },
      size: {
        default: "h-10 py-2 px-4 text-sm",
        sm: "h-9 px-3 rounded-md text-sm",
        icon: "size-8 h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { buttonVariants };
