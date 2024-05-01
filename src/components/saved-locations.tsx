"use client";

import { weatherReportPageParamsSchema } from "~/definitions/page-params";
import { useSavedLocations } from "~/hooks/use-saved-locations";
import Link from "next/link";
weatherReportPageParamsSchema;

function SavedLocations() {
  const savedLocations = useSavedLocations();

  if (!savedLocations) return null;
  const { locations } = savedLocations;
  if (locations.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-1.5 p-4">
      {locations.map((loc) => {
        const { country, name } = loc;

        const params = {
          query: name,
          country,
        } satisfies weatherReportPageParamsSchema;

        return (
          <Link
            key={name + country}
            href={`/weather?${new URLSearchParams(params).toString()}`}
            className={
              "focus:ring-ring bg-primary text-primary-foreground hover:bg-xamber-9 inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            }
          >
            {name}, {country}
          </Link>
        );
      })}
    </div>
  );
}

export { SavedLocations };
