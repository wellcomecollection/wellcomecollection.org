import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { ConceptLinkSource } from '@weco/common/data/segment-values';
import { LinkProps } from '@weco/common/model/link-props';
import { LinkFrom } from '@weco/common/utils/routes';

type ConceptLinkProps = { conceptId: string };

function toLink(props: ConceptLinkProps, source: ConceptLinkSource): LinkProps {
  return {
    href: {
      pathname: '/concepts/[conceptId]',
      query: {
        conceptId: props.conceptId,
        source,
      },
    },
    as: {
      pathname: `/concepts/${props.conceptId}`,
    },
  };
}

type Props = LinkFrom<ConceptLinkProps> & {
  source: ConceptLinkSource;
};

const ConceptLink: FunctionComponent<Props> = ({
  children,
  source,
  ...props
}) => {
  return (
    <NextLink
      {...toLink(props, source)}
      legacyBehavior
      data-component="concept-link"
    >
      {children}
    </NextLink>
  );
};

export default ConceptLink;
export { toLink };
