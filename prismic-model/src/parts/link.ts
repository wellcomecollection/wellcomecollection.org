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
  placeholder?: string;
} & (
  | {
      linkedTypes: string[];
    }
  | {
      linkedType: string;
    }
);

export function documentLink(label: string, props: DocumentLinkProps) {
  const linkMask =
    'linkedType' in props ? [props.linkedType] : props.linkedTypes;

  return link(label, 'document', linkMask, props.placeholder);
}

export function webLink(label: string, props?: { placeholder: string }) {
  return link(label, 'web', [], props?.placeholder);
}

export function mediaLink(label: string, props?: { placeholder: string }) {
  return link(label, 'media', [], props?.placeholder);
}
