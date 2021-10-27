type LinkType = 'web' | 'document' | 'media';

export default function (
  label: string,
  linkType: LinkType = null, // Prismic adds this as `null`, so it helps with the diffing
  linkMask: string[] = [],
  placeHolder?: string
) {
  return {
    type: 'Link',
    config: {
      label: label,
      select: linkType ?? null,
      customtypes: linkMask,
      placeholder: placeHolder,
    },
  };
}
