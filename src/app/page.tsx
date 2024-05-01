import { ThemeToggle } from "~/components/theme-toggle";
import { WeatherSearch } from "./weather-search";
import { LocationNameBanner } from "~/components/location-name-banner";
import { SavedLocations } from "~/components/saved-locations";

export default function Home() {
  return (
    <main className="grid min-h-screen place-content-center">
      <LocationNameBanner className="">Weather</LocationNameBanner>
      <WeatherSearch />
      <SavedLocations />
      <ThemeToggle className="absolute bottom-6 left-1/2 -translate-x-1/2" />
    </main>
  );
}
