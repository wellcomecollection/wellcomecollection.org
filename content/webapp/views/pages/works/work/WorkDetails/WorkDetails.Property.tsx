import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';

type InlineHeadingProps = {
  $inlineHeading?: boolean;
};

const Wrapper = styled.div.attrs({
  className: font('intr', -1),
})<InlineHeadingProps>`
  ${props => (props.$inlineHeading ? 'display: flex;' : '')}
`;

const Title = styled(Space).attrs<InlineHeadingProps>(props => ({
  as: 'h3',
  className: font('intsb', -1),
  $h: { size: 's', properties: props.$inlineHeading ? ['margin-right'] : [] },
}))<InlineHeadingProps>`
  ${props => (!props.$inlineHeading ? 'margin: 0;' : '')}
  margin-bottom: 0;
`;

export type Props = PropsWithChildren<{
  title?: string;
  inlineHeading?: boolean;
  noSpacing?: boolean;
}>;

const WorkDetailsProperty: FunctionComponent<Props> = ({
  title,
  inlineHeading,
  noSpacing,
  children,
}) => {
  return (
    <ConditionalWrapper
      condition={!noSpacing}
      wrapper={children => <SpacingComponent>{children}</SpacingComponent>}
    >
      <Wrapper $inlineHeading={inlineHeading}>
        {title && <Title $inlineHeading={inlineHeading}>{title}</Title>}
        {children}
      </Wrapper>
    </ConditionalWrapper>
  );
};

export default WorkDetailsProperty;
