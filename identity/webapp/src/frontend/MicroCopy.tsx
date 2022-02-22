// on hold (0). --- change to --- Request processing
// bib hold ready for pickup (b). --- change to --- Available to view
// volume hold ready for pickup (j). --- change to --- Available to view
// item ready for pickup (i). --- change to --- Available to view
// bib, item or volume in transit to pickup location. (t) --- change to --- In transit

export const sierraStatusCodeToLabel = {
  // statusCode (status.id): new label,
  '0': 'Request processing',
  b: 'Available to view',
  j: 'Available to view',
  i: 'Available to view',
  t: 'In transit',
};
