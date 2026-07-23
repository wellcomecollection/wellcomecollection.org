import styled from 'styled-components';

export const MainViewerContainer = styled.div<{ $useFixedList: boolean }>`
  height: 100%;
  ${props =>
    props.$useFixedList
      ? `
    overflow: hidden;
  `
      : `
    position: relative;
  `}
`;

export const ItemWrapper = styled.div<{ $firstItemIsRestricted?: boolean }>`
  height: 100%;
  ${props => (props.$firstItemIsRestricted ? 'margin-top: 2em;' : null)}

  .pdf-wrapper,
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }

  video {
    display: block;
    max-height: 100%;
    max-width: 100%;
    margin: 0 auto;
  }
`;
