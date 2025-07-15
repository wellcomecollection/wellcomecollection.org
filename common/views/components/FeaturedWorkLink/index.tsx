import { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Space from '@weco/common/views/components/styled/Space';

const WorkLinkWithIcon = styled.a`
  text-decoration-style: dotted;
  text-underline-offset: 26%;
  text-decoration-thickness: 8%;

  &::before {
    content: '';
    position: relative;

    background-image: url('https://i.wellcomecollection.org/assets/icons/favicon-32x32.png');
    background-repeat: no-repeat;
    background-size: 1em;
    background-position: center;
    padding-right: 1.25em;
  }
`;

// Only returns true if the link is a link from our catalogue
const hasLinkedWork = (taslSourceLink?: string) => {
  return Boolean(
    taslSourceLink &&
      taslSourceLink.indexOf('wellcomecollection.org/works/') > -1
  );
};

const FeaturedWorkLink = ({
  link,
  content,
  hasWrapper = false,
  ...rest
}: {
  link?: string;
  content?: string | ReactNode;
  hasWrapper?: boolean;
} & HTMLAttributes<HTMLAnchorElement>) => {
  if (!(link && hasLinkedWork(link))) return null;

  return (
    <ConditionalWrapper
      condition={hasWrapper}
      wrapper={children => (
        <Space
          className={font('intm', 5)}
          style={{ display: 'block' }}
          $v={{ size: 'm', properties: ['margin-top'] }}
        >
          {children}
        </Space>
      )}
    >
      <WorkLinkWithIcon href={link} data-gtm-id="work-link-component" {...rest}>
        {content || 'View in catalogue'}
      </WorkLinkWithIcon>
    </ConditionalWrapper>
  );
};

export default FeaturedWorkLink;
export { hasLinkedWork };
