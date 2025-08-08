import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { LinkProps } from '@weco/common/model/link-props';
import { LinkFrom } from '@weco/common/utils/routes';

type ConceptLinkProps = { conceptId: string };

function toConceptLink(props: ConceptLinkProps): LinkProps {
  return {
    href: {
      pathname: '/concepts/[conceptId]',
      query: {
        conceptId: props.conceptId,
      },
    },
  };
}

const ConceptLink: FunctionComponent<LinkFrom<ConceptLinkProps>> = ({
  children,
  ...props
}) => {
  return <NextLink {...toConceptLink(props)}>{children}</NextLink>;
};

export default ConceptLink;
export { toConceptLink };
