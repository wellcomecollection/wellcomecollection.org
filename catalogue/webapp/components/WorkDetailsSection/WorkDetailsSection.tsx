import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import { FunctionComponent, PropsWithChildren, useContext } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import IsArchiveContext from '../IsArchiveContext/IsArchiveContext';

type Props = PropsWithChildren<{
  headingText?: string;
}>;

type SectionWithDividerProps = { isArchive: boolean };
const SectionWithDivider = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top'] },
})<SectionWithDividerProps>`
  ${props =>
    props.isArchive &&
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
    <SectionWithDivider isArchive={isArchive}>
      <SpacingSection>
        {headingText && <h2 className="h3">{headingText}</h2>}

        {children}
      </SpacingSection>
    </SectionWithDivider>
  );
};

export default WorkDetailsSection;
