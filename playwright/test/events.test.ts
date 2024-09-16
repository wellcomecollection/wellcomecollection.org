import { expect, test } from '@playwright/test';

import { event } from './helpers/contexts';

test('single event pages include the scheduled events', async ({
  page,
  context,
}) => {
  await event('XagmOxAAACIAo0v8', context, page);
  const pastEventsLocator = page.getByRole('heading', { name: 'Past events' });
  // The dates for events are present in two places:
  //  - in a list of dates for events
  //  - a heading for the section showing the events happening on that day
  // This test seeks the latter one.
  const dateLocator = page.getByRole('heading', {
    name: 'Saturday 30 November 2019',
  });
  // Heart n Soul Radio occured twice, once in November, once in December
  const eventNameLocator = page
    .getByRole('heading', { name: 'Powerful Portraits' })
    .first();
  await expect(pastEventsLocator).toBeVisible();
  await expect(dateLocator).toBeVisible();
  await expect(eventNameLocator).toBeVisible();
});
