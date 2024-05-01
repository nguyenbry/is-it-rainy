import type { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

function LocationNameBanner({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <h2
      className={cn(
        "animate-in slide-in-from-bottom-11 fade-in-0 inline whitespace-normal text-8xl font-semibold italic tracking-tighter transition-all duration-1000 hover:ml-2 hover:text-amber-400",
        className,
      )}
      style={{
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </h2>
  );
}

export { LocationNameBanner };
