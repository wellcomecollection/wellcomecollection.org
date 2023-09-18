// Note: I'm not sure what these fetch links do, because it's unclear
// what part of our Prismic types they refer to -- e.g. there's no field
// called 'exhibition-resources', only 'resources'.
//
// To work out what they do, it would be useful to:
//
//    1. Find the Prismic fetchers where we use these fetch fields
//    2. Find the ID of every document that might be affected
//    3. Fetch each of those documents, with and without these fetch fields
//    4. Compare the responses for any difference
//
// If all the responses are the same, these aren't do anything and we can remove
// them.  If the responses are different, that gives us a clue as to what these
// are doing, and we can match them up to the associated Prismic types.
//
// (But I don't have time to do that right now.)

export const eventAccessOptionsFields = [
  'event-access-options.title',
  'event-access-options.description',
  'event-access-options.description',
];
export const labelsFields = ['labels.title', 'labels.description'];
