import type { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

function Container({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "hover:border-xamber-7 hover:text-xamber-11 hover:bg-xamber-3 group flex min-h-[100px] flex-col rounded-md border p-2.5 transition-all",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Value({ children }: PropsWithChildren) {
  return (
    <span className="ml-auto mt-auto text-3xl font-light transition-all group-hover:mr-2 group-hover:text-4xl">
      {children}
    </span>
  );
}

function Label({ children }: PropsWithChildren) {
  return (
    <span className="text-xslate-11 whitespace-nowrap text-xs font-semibold uppercase tracking-tight">
      {children}
    </span>
  );
}

export { Container, Label, Value };
