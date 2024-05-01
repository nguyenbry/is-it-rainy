import Link from "next/link";
import { buttonVariants } from "~/components/shared-styles";
import { cn } from "~/lib/utils";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-content-center gap-5 p-5">
      <h1 className="animate-in slide-in-from-bottom-11 fade-in-0 text-7xl font-semibold italic tracking-tighter transition-all duration-1000">
        Uh oh! Your city was not found
      </h1>
      <Link
        href={"/"}
        className={cn(buttonVariants(), "max-w-max justify-self-center")}
      >
        Try again?
      </Link>
    </main>
  );
}
