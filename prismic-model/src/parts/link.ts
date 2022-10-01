type LinkType = 'web' | 'document' | 'media';

function link(
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

export default link;

type DocumentLinkProps = {
  label: string;
  placeholder?: string;
} & (
  | {
      linkedTypes: string[];
    }
  | {
      linkedType: string;
    }
);

export function documentLink(props: DocumentLinkProps) {
  const linkMask =
    'linkedType' in props ? [props.linkedType] : props.linkedTypes;

  return link(props.label, 'document', linkMask, props.placeholder);
}
