import { FunctionComponent, PropsWithChildren, useContext } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import IsArchiveContext from '@weco/content/components/IsArchiveContext/IsArchiveContext';

type Props = PropsWithChildren<{
  headingText?: string;
}>;

const SectionWithDivider = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top'] },
})<{ $isArchive: boolean }>`
  ${props =>
    props.$isArchive &&
    `
    &:nth-child(1) {
      padding-top: 0;
    }
  `}
  & + & {
    border-top: 1px solid ${props => props.theme.color('neutral.400')};
  }
`;

const WorkDetailsSection: FunctionComponent<Props> = ({
  headingText,
  children,
}) => {
  const isArchive = useContext(IsArchiveContext);

  return (
    <SectionWithDivider $isArchive={isArchive}>
      <SpacingSection>
        {headingText && <h2 className={font('wb', 4)}>{headingText}</h2>}

        {children}
      </SpacingSection>
    </SectionWithDivider>
  );
};

export default WorkDetailsSection;
