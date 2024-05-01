import { ThemeToggle } from "~/components/theme-toggle";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { WeatherReport } from "~/components/weather-report";
import { LocationNameBanner } from "~/components/location-name-banner";
import { weatherReportPageParamsSchema } from "~/definitions/page-params";

async function WeatherPage({ searchParams }: { searchParams: unknown }) {
  const parsed = weatherReportPageParamsSchema.parse(searchParams);

  /**
   * While we wait for the pieces of the page that need
   * to fetch data, show a loading spinner and a banner
   * of what they searched for.
   */
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense
        fallback={
          <div className="flex grow items-center px-4">
            <Loader2 className="size-12 animate-spin" />
            <LocationNameBanner>{parsed.query}</LocationNameBanner>
          </div>
        }
      >
        <WeatherReport {...parsed} />
      </Suspense>
      <ThemeToggle className="my-3 self-center" />
    </main>
  );
}

export default WeatherPage;
