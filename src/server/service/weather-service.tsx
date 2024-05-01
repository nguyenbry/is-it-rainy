import { z } from "zod";
import { env } from "~/env";
import {
  type WeatherService,
  forecastSchema,
  weatherSchema,
} from "./weather-service.def";

const allowedRoutes = {
  "/data/2.5/weather": ["q", "units"],
  "/data/2.5/forecast": ["lat", "lon", "units"],
} as const satisfies Record<string, string[]>;

class MyWeatherService implements WeatherService {
  private openWeatherBaseUrl = z
    .string()
    .refine((x) => !x.endsWith("/"), {
      message: "baseUrl should not end with a slash",
    })
    .parse("https://api.openweathermap.org");
  private openWeatherApiKey: string;

  constructor(apiKey: string) {
    this.openWeatherApiKey = apiKey;
  }

  private async fetchOpenWeatherRoute<T extends keyof typeof allowedRoutes>({
    path,
    query,
  }: {
    path: T;
    query: { [K in (typeof allowedRoutes)[T][number]]: string };
  }) {
    const search = new URLSearchParams(query);
    search.set("appId", this.openWeatherApiKey);

    const url = `${this.openWeatherBaseUrl}${path}?${search.toString()}`;
    const res = await fetch(url);
    return this.fetchWrapped(res);
  }

  private async fetchWrapped(res: Awaited<ReturnType<typeof fetch>>): Promise<
    | {
        data: unknown;
        error: null;
      }
    | {
        data: null;
        error: string;
        code: number;
      }
  > {
    if (res.ok) {
      return {
        data: (await res.json()) as Promise<unknown>,
        error: null,
      };
    }

    let someInfo = "An unknown error occurred";

    try {
      const data = (await res.json()) as unknown;

      // It seems like the API always returns an object with a `cod` and `message` field
      // so we'll try it first
      const parsed = z
        .object({
          message: z.string(),
        })
        .safeParse(data);

      if (parsed.success) {
        return {
          data: null,
          error: parsed.data.message,
          code: res.status,
        };
      }

      someInfo = JSON.stringify(data);
    } catch {
      // couldn't get JSON for some reason, try text
      try {
        someInfo = await res.text();
      } catch {
        someInfo = "An unknown error occurred";
      }
    }

    console.error(
      `Failed to fetch ${res.url} with status ${res.status}: ${someInfo}`,
    );

    return {
      data: null,
      error: someInfo,
      code: res.status,
    };
  }

  public async getWeather({
    cityOrZip,
    country,
    state,
  }: {
    cityOrZip: string;
    state?: string;
    country?: string;
  }) {
    const q = [cityOrZip, state, country].filter((x) => !!x).join(",");

    const data = await this.fetchOpenWeatherRoute({
      path: "/data/2.5/weather",
      query: {
        q,
        units: "imperial",
      },
    });

    /**
     * If there is an error that I know about, I'll return it in the error field.
     *
     * I let all other errors throw because they are unexpected and should cause
     * a 500 error.
     */
    if (data.error !== null) {
      return {
        error: data.error,
        code: data.code,
        data: null,
      };
    }
    return { data: weatherSchema.parse(data.data), error: null };
  }

  public async getForecast({ lon, lat }: { lat: number; lon: number }) {
    const data = await this.fetchOpenWeatherRoute({
      path: "/data/2.5/forecast",
      query: {
        lat: lat.toString(),
        lon: lon.toString(),
        units: "imperial",
      },
    });

    if (data.error !== null) {
      return {
        error: data.error,
        code: data.code,
        data: null,
      };
    }

    return {
      data: forecastSchema.parse(data.data),
      error: null,
    };
  }
}

const weatherSvc: WeatherService = new MyWeatherService(env.OPENWEATHER_KEY);

export { weatherSvc };
