import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';

type Props = {
  $sectionLevelPage: boolean;
};

export const SectionPageHeader = styled.h1.attrs<Props>(props => ({
  className: font('wb', props.$sectionLevelPage ? 0 : 1),
}))<Props>`
  display: inline-block;
  margin: 0 !important;
`;
