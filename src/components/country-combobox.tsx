"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { iso31661 } from "iso-3166";

export function CountryCombobox({
  onChange,
  value,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const selectedCountry = iso31661.find((x) => x.alpha2 === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedCountry ? "primary" : "outline"}
          role="combobox"
          aria-expanded={open}
          className="shrink-0 justify-between truncate"
        >
          {selectedCountry ? selectedCountry.alpha2 : "country"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[400px] p-0">
        <Command
          filter={(itemValueAlreadyLower, search) => {
            if (itemValueAlreadyLower.includes(search.toLowerCase().trim()))
              return 1;
            return 0;
          }}
        >
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No countries found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {iso31661.map((country) => {
                const { alpha2: countryAbbrev, name } = country;
                /**
                 * Include everything the user might search for here
                 */
                const searchableValue =
                  `${countryAbbrev} ${name}`.toLowerCase();

                const isSelected = Object.is(country, selectedCountry);

                return (
                  <CommandItem
                    key={countryAbbrev}
                    value={searchableValue}
                    onSelect={() => {
                      onChange(isSelected ? undefined : countryAbbrev);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {countryAbbrev} - {name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
