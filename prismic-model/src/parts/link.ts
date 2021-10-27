type LinkType = 'web' | 'document' | 'media';

export default function (
  label: string,
  linkType: LinkType = null, // Prismic adds this as `null`, so it helps with the diffing
  linkMask: string[] = [],
  placeHolder?: string
) {
  return {
    type: 'Link',
    config:
      // This is because Prismic annoyingly reorders props dependant on if customtypes is set.
      linkType === null
        ? {
            label: label,
            customtypes: linkMask,
            select: linkType,
            placeholder: placeHolder,
          }
        : {
            label: label,
            select: linkType,
            customtypes: linkMask,
            placeholder: placeHolder,
          },
  };
}
