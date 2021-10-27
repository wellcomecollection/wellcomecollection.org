type LinkType = 'web' | 'document' | 'media';

export default function (
  label: string,
  linkType?: LinkType,
  linkMask: string[] = [],
  placeHolder?: string
) {
  return {
    type: 'Link',
    config: {
      label: label,
      select: linkType,
      customtypes: linkMask,
      placeholder: placeHolder,
    },
  };
}
