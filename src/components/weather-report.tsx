import { iconComponentMap } from "~/components/weather-icons";
import { ChevronLeft, Sunrise, Sunset } from "lucide-react";
import * as WeatherCard from "~/components/weather-card";
import { LocalTimeWithTimezone } from "~/components/local-time-with-timezone";
import { ClientDate } from "~/components/client-date";
import { LocationNameBanner } from "./location-name-banner";
import { capitalize, timezoneAwareDate } from "~/lib/utils";
import { WeatherForecast, WeatherForecastLoading } from "./weather-forecast";
import { Suspense } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { SaveLocationButton } from "./save-location-button";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "./shared-styles";
import { weatherSvc } from "~/server/service/weather-service";

function ForecastArea(props: React.ComponentProps<typeof WeatherForecast>) {
  return (
    <>
      <span className="text-xslate-11 self-center text-lg">5-Day Forecast</span>
      <ScrollArea className="my-4 w-full whitespace-nowrap sm:px-4">
        <div className="flex justify-center gap-3 p-3">
          <Suspense fallback={<WeatherForecastLoading />}>
            <WeatherForecast {...props} />
          </Suspense>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}

async function WeatherReport({
  query,
  country,
  state,
}: {
  query: string;
  state?: string | undefined;
  country?: string | undefined;
}) {
  const result = await weatherSvc.getWeather({
    cityOrZip: query,
    country,
    state,
  });

  if (result.error !== null) {
    if (result.code === 404) notFound();

    throw new Error(result.error);
  }

  const data = result.data;

  const weather = data.weather[0];

  if (!weather) throw new Error("No weather data");

  const Icon = iconComponentMap[weather.icon];

  return (
    <>
      <div className="inline-flex items-center pl-1.5">
        <Link
          href={"/"}
          className={buttonVariants({
            size: "icon",
            variant: "ghost",
          })}
        >
          <ChevronLeft className="size-5" />
        </Link>
        <LocationNameBanner>{data.name}</LocationNameBanner>
      </div>
      <Icon className="animate-in spin-in-12 fade-in-0 size-20 self-center duration-1000 hover:scale-110" />
      <span className="animate-in spin-in-6 slide-in-from-bottom-8 fade-in-0 mt-3 self-center text-7xl font-light tracking-tighter">
        {Math.round(data.main.temp)}°F
      </span>
      <span className="text-xslate-11 self-center">
        {capitalize(weather.main)} | {weather.description}
      </span>
      <div className="mx-auto my-4 grid w-full shrink-0 grid-cols-2 gap-3 p-3 sm:w-[90dvw] md:w-[85dvw] md:grid-cols-3 lg:grid-cols-5 xl:w-[70dvw] 2xl:w-[60dvw]">
        <WeatherCard.Container className="grow">
          <WeatherCard.Label>feels like</WeatherCard.Label>
          <WeatherCard.Value>
            {Math.round(data.main.feels_like)}°F
          </WeatherCard.Value>
        </WeatherCard.Container>

        <WeatherCard.Container>
          <WeatherCard.Label>humidity</WeatherCard.Label>
          <WeatherCard.Value>{data.main.humidity}%</WeatherCard.Value>
        </WeatherCard.Container>

        <WeatherCard.Container>
          <WeatherCard.Label>wind</WeatherCard.Label>
          <WeatherCard.Value>{data.wind.speed.toFixed(1)}mph</WeatherCard.Value>
        </WeatherCard.Container>

        <WeatherCard.Container className="relative">
          <WeatherCard.Label>sunset (in {data.name})</WeatherCard.Label>
          <Sunset className="absolute bottom-2 left-2 size-6 text-orange-500" />
          <WeatherCard.Value>
            {timezoneAwareDate(data.sys.sunset, data.timezone).toFormat(
              "h:mm a",
            )}
          </WeatherCard.Value>
        </WeatherCard.Container>

        <WeatherCard.Container className="relative">
          <WeatherCard.Label>sunrise (in {data.name})</WeatherCard.Label>
          <Sunrise className="absolute bottom-2 left-2 size-6 text-amber-500" />
          <WeatherCard.Value>
            {timezoneAwareDate(data.sys.sunrise, data.timezone).toFormat(
              "h:mm a",
            )}
          </WeatherCard.Value>
        </WeatherCard.Container>
      </div>

      {/* this requires another fetch so we'll stream it in  */}
      <ForecastArea {...data.coord} timezone={data.timezone} />

      <SaveLocationButton
        className="mb-3 mt-auto self-center"
        name={data.name}
        country={data.sys.country}
      />
      <span className="text-xslate-11 self-center text-xs font-light">
        Last updated: <ClientDate secondsUnix={data.dt} /> (local)
      </span>
      <span
        className="text-xslate-11 self-center text-xs font-light"
        /**
         * Formatting dates on server/client may cause a hydration mismatch
         * but fine to ignore.
         */
        suppressHydrationWarning
      >
        Time in {data.name}: <LocalTimeWithTimezone timezone={data.timezone} />
      </span>
    </>
  );
}

export { WeatherReport };
