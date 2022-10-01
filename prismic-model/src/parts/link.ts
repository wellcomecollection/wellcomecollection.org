type LinkType = 'web' | 'document' | 'media';

export default function (
  label: string,
  linkType: LinkType = null, // Prismic adds this as `null`, so it helps with the diffing
  linkMask: string[] = [],
  placeholder?: string
) {
  return {
    type: 'Link',
    config:
      // This is because Prismic annoyingly reorders props dependant on if customtypes is set.
      linkType === null
        ? {
            label,
            customtypes: linkMask,
            select: linkType,
            placeholder,
          }
        : {
            label,
            select: linkType,
            customtypes: linkMask,
            placeholder,
          },
  };
}
