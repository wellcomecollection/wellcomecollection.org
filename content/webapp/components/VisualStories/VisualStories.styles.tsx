import styled from 'styled-components';

export const PrototypeH1 = styled.h1.attrs({ className: 'h0' })``;

export const TwoUp = styled.div`
  display: grid;
  grid-gap: 50px;

  ${props => props.theme.media('medium')`
    grid-template-columns: 1fr 1fr;
  `}
`;

export const NoSpacedText = styled.div`
  & * + * {
    margin-top: revert;
  }
`;
