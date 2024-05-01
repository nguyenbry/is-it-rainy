import { z } from "zod";
import { DateTime } from "luxon";

type ExampleResponse = {
  coord: {
    lon: 10.99;
    lat: 44.34;
  };
  weather: [
    {
      id: 501;
      main: "Rain";
      description: "moderate rain";
      icon: "10d";
    },
  ];
  base: "stations";
  main: {
    temp: 298.48;
    feels_like: 298.74;
    temp_min: 297.56;
    temp_max: 300.05;
    pressure: 1015;
    humidity: 64;
    sea_level: 1015;
    grnd_level: 933;
  };
  visibility: 10000;
  wind: {
    speed: 0.62;
    deg: 349;
    gust: 1.18;
  };
  rain: {
    "1h": 3.16;
  };
  clouds: {
    all: 100; // percentage
  };
  dt: 1661870592;
  sys: {
    type: 2;
    id: 2075663;
    country: "IT";
    sunrise: 1661834187;
    sunset: 1661882248;
  };
  timezone: 7200;
  id: 3163858;
  name: "Zocca";
  cod: 200;
};

type IconCodePrefix =
  | "01"
  | "02"
  | "03"
  | "04"
  | "09"
  | "10"
  | "11"
  | "13"
  | "50";
type IconCodeSuffix = "d" | "n";
type IconCode = `${IconCodePrefix}${IconCodeSuffix}`;

const iconCodeSchema = z.enum([
  "01d",
  "01n",
  "02d",
  "02n",
  "03d",
  "03n",
  "04d",
  "04n",
  "09d",
  "09n",
  "10d",
  "10n",
  "11d",
  "11n",
  "13d",
  "13n",
  "50d",
  "50n",
] as const satisfies IconCode[]);

const weatherSchema = z.object({
  coord: z.object({
    lon: z.number(),
    lat: z.number(),
  }),
  weather: z
    .array(
      z.object({
        id: z.number(),
        main: z.string(),
        description: z.string(),
        icon: iconCodeSchema,
      }),
    )
    .min(1), // we need at least one to show
  main: z.object({
    temp: z.number(), // fahrenheit (for imperial)
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  visibility: z.number(), // in meters
  wind: z.object({
    speed: z.number(), // mph
    deg: z.number(),
  }),
  rain: z
    .object({
      "1h": z.number().optional(), // where available, in millimeters
      "3h": z.number().optional(), // where available, in millimeters
    })
    .optional(),
  snow: z
    .object({
      "1h": z.number().optional(), // where available, in millimeters
      "3h": z.number().optional(), // where available, in millimeters
    })
    .optional(),
  clouds: z.object({
    all: z.number(),
  }),
  dt: z.number(), // Time of data calculation, unix,
  sys: z.object({
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
  timezone: z.number(),
  name: z.string(),
});

type weatherSchema = z.infer<typeof weatherSchema>;

const forecastSchema = z.object({
  cnt: z.number().int(),
  list: z.array(
    weatherSchema
      .pick({
        main: true,
        weather: true,
        clouds: true,
        wind: true,
        rain: true,
      })
      .extend({
        dt_txt: z.string().refine((x) => {
          const split = x.split(" ");
          if (split.length < 2) {
            return false;
          }
          const [date, time] = split;

          if (!date || !time) {
            return false;
          }

          const iso = `${date}T${time}Z`;

          return DateTime.fromISO(iso).isValid;
        }),
      })
      .transform((x) => {
        const [date, time] = x.dt_txt.split(" ");

        return {
          ...x,
          // to keep it consistent with the other schema, divide by 1000
          dt: Math.round(
            DateTime.fromISO(`${date}T${time}Z`).toMillis() / 1000,
          ),
        };
      }),
  ),
});

type forecastSchema = z.infer<typeof forecastSchema>;

/**
 * I am basing my validator off of an example response I got from the API.
 *
 * I can use TypeScript to guard against the validator definitely not matching
 * the response during development. It doesn't guarantee it will match,
 * but can save me from some typos perhaps.
 *
 * That is, I can be sure my schema matches at least 1 possible response,
 * which is a good place to start.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _mustCompile: ExampleResponse extends weatherSchema ? true : false = true;

interface WeatherService {
  getWeather: (opts: {
    cityOrZip: string;
    state?: string;
    country?: string;
  }) => Promise<
    | {
        data: weatherSchema;
        error: null;
      }
    | {
        data: null;
        error: string;
        code: number;
      }
  >;
  getForecast: (opts: weatherSchema["coord"]) => Promise<
    | {
        data: forecastSchema;
        error: null;
      }
    | {
        data: null;
        error: string;
        code: number;
      }
  >;
}

export { type WeatherService, weatherSchema, forecastSchema };
