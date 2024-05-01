"use client";

import { DateTime } from "luxon";

/**
 * This is a really weird pattern, but we don't want to be
 * doing any date formatting with SSR. This is because we
 * want to use the user's locale, and we can't do that on
 * the server.
 */

function ClientDate({ secondsUnix }: { secondsUnix: number }) {
  // implicitly uses the user's locale
  return DateTime.fromSeconds(secondsUnix).toFormat("ff");
}

export { ClientDate };
