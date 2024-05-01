import {
  Cloud,
  CloudDrizzle,
  CloudMoon,
  CloudMoonRain,
  CloudRainWind,
  CloudSun,
  CloudSunRain,
  Cloudy,
  Moon,
  Snowflake,
  Sun,
  Tornado,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { WeatherService } from "~/server/service/weather-service.def";

type WeatherData = NonNullable<
  Awaited<ReturnType<WeatherService["getWeather"]>>["data"]
>;

type IconCode = WeatherData["weather"][number]["icon"];

/**
 * Provide icons components for each weather code.
 *
 * These codes were specified in the OpenWeatherMap API documentation.
 */
const iconComponentMap: {
  [K in IconCode]: (props: { className?: string }) => React.ReactNode;
} = {
  "01d": ({ className }) => <Sun className={cn("text-amber-400", className)} />,
  "01n": ({ className }) => (
    <Moon className={cn("text-indigo-700", className)} />
  ),
  "02d": CloudSun,
  "02n": CloudMoon,
  "03d": ({ className }) => (
    <Cloud className={cn("text-xslate-10 fill-xslate-10", className)} />
  ),
  "03n": ({ className }) => (
    <Cloud className={cn("text-xslate-10 fill-xslate-10", className)} />
  ),
  "04d": Cloudy,
  "04n": Cloudy,
  "09d": CloudDrizzle,
  "09n": CloudDrizzle,
  "10d": CloudSunRain,
  "10n": CloudMoonRain,
  "11d": CloudRainWind,
  "11n": CloudRainWind,
  "13d": ({ className }) => (
    <Snowflake className={cn("text-sky-500", className)} />
  ),
  "13n": ({ className }) => (
    <Snowflake className={cn("text-sky-500", className)} />
  ),
  "50d": Tornado, // similar to the one they use on the OpenWeatherMap website
  "50n": Tornado,
};

export { iconComponentMap };
