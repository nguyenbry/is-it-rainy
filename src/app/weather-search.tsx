"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { CountryCombobox } from "~/components/country-combobox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function WeatherSearch() {
  const [query, setQuery] = React.useState("");
  const [country, setCountry] = React.useState<string>();

  const router = useRouter();

  return (
    <div className="bg-card flex w-screen flex-col p-5 md:w-[90dvw] md:p-8 lg:w-[80dvw] 2xl:w-[1200px]">
      <form
        className="flex flex-col justify-center gap-4 md:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          const cleaned = query.trim();
          if (cleaned.length < 1)
            return toast.error("Please type a city or zip code.", {
              dismissible: true,
            });
          const params = new URLSearchParams({
            query: cleaned,
          });
          if (country) params.set("country", country);
          router.push(`/weather?${params.toString()}`);
        }}
      >
        <Input
          className="grow"
          placeholder="Type a city or zip code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          name="query"
        />
        <CountryCombobox value={country} onChange={setCountry} />
        <Button variant={"default"} className="shrink-0" type="submit">
          Search
        </Button>
      </form>
    </div>
  );
}

export { WeatherSearch };
