// Renders a date in the local timezone, including day of the week.
// e.g. "Fri, 22 May 2020"
const dateFormatter = new Intl.DateTimeFormat([], {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

// Renders an HH:MM time in the local timezone, including timezone info.
// e.g. "12:17 BST"
const timeFormatter = new Intl.DateTimeFormat([], {
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
});

// Given an ISO 8601 date string, render it as a more friendly date
// in the user's timezone.
//
// Examples:
// - "today @ 12:00 BST"
// - "yesterday @ 11:00 CST"
// - "Fri, 22 May 2020 @ 10:00 PST"
//
// From https://alexwlchan.net/2020/05/human-friendly-dates-in-javascript/
export function getHumanFriendlyDateString(iso8601DateString: string): string {
  const date = new Date(Date.parse(iso8601DateString));

  // When are today and yesterday?
  const today = new Date();
  const yesterday = new Date().setDate(today.getDate() - 1);

  // We have to compare the *formatted* dates rather than the actual dates --
  // for example, if the UTC date and the localised date fall on either side
  // of midnight.
  if (dateFormatter.format(date) === dateFormatter.format(today)) {
    return 'today @ ' + timeFormatter.format(date);
  } else if (dateFormatter.format(date) === dateFormatter.format(yesterday)) {
    return 'yesterday @ ' + timeFormatter.format(date);
  } else {
    return dateFormatter.format(date) + ' @ ' + timeFormatter.format(date);
  }
}
