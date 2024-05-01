import { weatherSvc } from "~/server/service/weather-service";
import { iconComponentMap } from "./weather-icons";
import { timezoneAwareDate } from "~/lib/utils";
import { CircleX } from "lucide-react";

const NUM_FORECASTS = 5;

function tryGetForecastDays<T extends { dt: number }>(
  arr: T[],
  timezone: number,
): T[] {
  const nowLuxon = timezoneAwareDate(Date.now() / 1000, timezone);

  /**
   * I am going to consider around 12PM in the local timezone
   * to be the point of the day at which I want to show for
   * the forecast. We probably don't expect to see the weather
   * at night when we look at forecasts.
   */
  const startOfDayLocal = nowLuxon.startOf("day");

  /**
   * Today's date is already shown in the weather report,
   * so the forecast should start from tomorrow.
   */
  const firstDayOfForecast = startOfDayLocal
    .set({
      hour: 12, // go to noon
    })
    .plus({
      days: 1, // add a day because we don't want the first day of forecast to be today
    });

  const out: T[] = [];

  for (let i = 0; i < NUM_FORECASTS; i++) {
    const target = firstDayOfForecast.plus({
      days: i,
    });

    const targetSeconds = target.toSeconds();

    const closestToTargetSorted = arr.slice().sort((a, b) => {
      return Math.abs(a.dt - targetSeconds) - Math.abs(b.dt - targetSeconds);
    });

    const [closest] = closestToTargetSorted;

    closest && out.push(closest);
  }

  return out;
}

async function WeatherForecast({
  lat,
  lon,
  timezone,
}: {
  lat: number;
  lon: number;
  timezone: number;
}) {
  const forecast = await weatherSvc.getForecast({ lat, lon });

  if (forecast.error !== null) return <ForecastError />;

  const subset = tryGetForecastDays(forecast.data.list, timezone);

  if (subset.length === 0) return <ForecastError />;

  return (
    <>
      {subset.map((day) => (
        <ForecastCard key={day.dt} timezone={timezone} {...day} />
      ))}
    </>
  );
}

function ForecastError() {
  return (
    <span className="text-xslate-11 inline-flex items-center gap-2">
      <CircleX className="text-xred-9 size-4" />
      We could not find the weather forecast
    </span>
  );
}

type ForecastDay = NonNullable<
  Awaited<ReturnType<typeof weatherSvc.getForecast>>["data"]
>["list"][number];

function ForecastCard({
  weather,
  main: { temp },
  dt,
  timezone,
}: ForecastDay & { timezone: number }) {
  const [first] = weather;
  if (!first) throw new Error("this was checked for already");

  const { icon, main } = first;

  const Icon = iconComponentMap[icon];

  return (
    <div className="animate-in fade-in-0 slide-in-from-top-11 hover:bg-xamber-3 hover:border-xamber-7 hover:text-xamber-11 flex w-[110px] flex-col items-center rounded-md border px-2 py-4 transition-all hover:-translate-y-3 md:w-[130px] lg:w-[150px]">
      <span className="text-sm">
        {timezoneAwareDate(dt, timezone).toFormat("d EEE")}
      </span>
      <Icon className="my-3 size-6" />
      <span className="text-sm">{Math.round(temp)}°F</span>
      <span className="text-sm">{main}</span>
    </div>
  );
}

function WeatherForecastLoading() {
  return (
    <div className="flex gap-4">
      {Array.from({ length: NUM_FORECASTS }).map((_, i) => {
        return (
          <div
            key={i}
            className="bg-xslate-4 flex h-[220px] w-[110px] animate-pulse flex-col items-center rounded-md border px-2 py-4 md:h-[150px] md:w-[130px] lg:w-[150px]"
          />
        );
      })}
    </div>
  );
}

export { WeatherForecast, WeatherForecastLoading };
