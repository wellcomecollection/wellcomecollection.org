import { ReactNode } from 'react';
import styled from 'styled-components';

import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Space from '@weco/common/views/components/styled/Space';

import { DarkSectionWrapper, Title } from './sub-theme.styles';

const SpacingWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})<{ $isFirst?: boolean }>`
  ${props => props.$isFirst && `padding-top: 0;`}
`;

const SectionContainer = ({
  title,
  id,
  hasDarkBackground,
  isFirst,
  children,
}: {
  title: string;
  id: string;
  hasDarkBackground?: boolean;
  isFirst?: boolean;
  children: ReactNode;
}) => {
  return (
    <ConditionalWrapper
      condition={!!hasDarkBackground}
      wrapper={children => <DarkSectionWrapper>{children}</DarkSectionWrapper>}
    >
      <SpacingWrapper $isFirst={isFirst}>
        <Title id={id} $hasDarkBackground={hasDarkBackground}>
          {title}
        </Title>
        {children}
      </SpacingWrapper>
    </ConditionalWrapper>
  );
};

export default SectionContainer;
