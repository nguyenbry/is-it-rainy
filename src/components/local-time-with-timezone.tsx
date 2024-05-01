"use client";

import * as React from "react";
import { timezoneAwareDate } from "~/lib/utils";

/**
 * Given a timezone, render a live updating "clock"
 * showing the current time with said timezone.
 *
 * We render a string with no markup for flexibility.
 *
 * Note this must be a client component because we don't
 * want any Date formatting to happen on the server.
 */

function LocalTimeWithTimezone({ timezone }: { timezone: number }) {
  const [now, setNow] = React.useState(
    timezoneAwareDate(Date.now() / 1000, timezone),
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setNow(timezoneAwareDate(Date.now() / 1000, timezone));
    }, 1000 * 30); // update every 30 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [timezone]);

  return now.toFormat("ff");
}

export { LocalTimeWithTimezone };
