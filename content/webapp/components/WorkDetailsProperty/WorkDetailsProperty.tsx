import { font } from '@weco/common/utils/classnames';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

type InlineHeadingProps = {
  inlineHeading?: boolean;
};

const Wrapper = styled.div.attrs({
  className: font('intr', 5, { small: 3, medium: 3 }),
})<InlineHeadingProps>`
  ${props => (props.inlineHeading ? 'display: flex;' : '')}
`;

const Title = styled(Space).attrs<InlineHeadingProps>(props => ({
  as: 'h3',
  h: {
    size: 's',
    properties: props.inlineHeading ? ['margin-right'] : [],
  },
  className: font('intb', 5, { small: 3, medium: 3 }),
}))<InlineHeadingProps>`
  ${props => (!props.inlineHeading ? 'margin: 0;' : '')}
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
      <Wrapper inlineHeading={inlineHeading}>
        {title && <Title inlineHeading={inlineHeading}>{title}</Title>}
        {children}
      </Wrapper>
    </ConditionalWrapper>
  );
};

export default WorkDetailsProperty;
