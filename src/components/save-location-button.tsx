"use client";

import { Button } from "./ui/button";
import { Star } from "lucide-react";
import {
  type savedLocationSchema,
  useSavedLocations,
} from "~/hooks/use-saved-locations";
import { cn } from "~/lib/utils";

function SaveLocationButton({
  className,
  name,
  country,
}: {
  className?: string;
} & savedLocationSchema) {
  const savedLocations = useSavedLocations();

  if (!savedLocations) return null;

  const { addLocation, locations, removeLocation } = savedLocations;

  const isSaved = locations.some(
    (x) => x.name === name && x.country === country,
  );

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      onClick={() =>
        isSaved
          ? removeLocation({ name, country })
          : addLocation({ name, country })
      }
      className={cn(className)}
    >
      <Star
        className={cn("size-5", isSaved && "fill-amber-500 text-amber-500")}
      />
    </Button>
  );
}

export { SaveLocationButton };
