import styled from 'styled-components';

type SectionPageHeader = {
  sectionLevelPage: boolean;
};
export const SectionPageHeader = styled.h1.attrs<SectionPageHeader>(() => ({
  className: 'h1 inline-block no-margin',
}))<SectionPageHeader>`
  ${props => props.sectionLevelPage && `font-size: 50px;`}
  @media (max-width: ${props => props.theme.sizes.medium}px) {
    ${props => props.sectionLevelPage && `font-size: 32px;`}
  }
`;
