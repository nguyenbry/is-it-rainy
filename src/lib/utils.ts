import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// we're just going to do everything in seconds because the Open Weather API uses it
function getUTCOffsetString(offsetSeconds: number) {
  const minutes = offsetSeconds / 60;
  const hours = Math.floor(minutes / 60);
  const leftoverMinutes = minutes % 60;

  z.number().int().parse(hours);
  z.number().int().parse(leftoverMinutes);

  return `UTC${hours >= 0 ? "+" : ""}${hours.toString()}:${leftoverMinutes.toString().padStart(2, "0")}`;
}

export function timezoneAwareDate(
  secondsUnix: number,
  timezoneOffsetSeconds: number,
): DateTime<true> {
  // Luxon docs says you can do this!
  const stringOffset = getUTCOffsetString(timezoneOffsetSeconds);

  // this is a timezone aware date
  const d = DateTime.fromSeconds(secondsUnix).setZone(stringOffset);

  if (!d.isValid) throw new Error("invalid date: " + stringOffset);
  return d;
}
