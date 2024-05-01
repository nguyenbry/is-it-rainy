"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

const savedLocationSchema = z.object({
  name: z.string(),
  country: z.string(),
});

type savedLocationSchema = z.infer<typeof savedLocationSchema>;

const LOCAL_STORAGE_KEY = "savedLocations-nguyenbry";

function getSavedLocations(): savedLocationSchema[] {
  // SSR guard just in case
  if (typeof window === "undefined") return [];

  const locations = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!locations) return [];

  try {
    const data = JSON.parse(locations) as unknown;

    const out: savedLocationSchema[] = [];

    if (Array.isArray(data)) {
      for (const x of data) {
        const parsed = savedLocationSchema.safeParse(x);
        if (parsed.success) {
          out.push(parsed.data);
        }
      }

      return out;
    } else return [];
  } catch {
    return [];
  }
}

function useSavedLocations() {
  const [locations, setLocations] = useState<savedLocationSchema[]>();

  /**
   * We interface with state within our app,
   * and this useEffect will reconcile it
   * with localStorage whenever it changes.
   */
  useEffect(() => {
    if (!locations) return; // not initialized yet
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    setLocations(getSavedLocations());
  }, []);

  // not initialized yet
  if (!locations) return undefined;

  const addLocation = (loc: savedLocationSchema) => {
    setLocations([...locations, loc]);
  };

  const removeLocation = (loc: savedLocationSchema) => {
    setLocations(
      locations.filter(
        (x) => !(x.country === loc.country && x.name === loc.name),
      ),
    );
  };

  return {
    addLocation,
    removeLocation,
    locations,
  };
}

export { useSavedLocations, type savedLocationSchema };
