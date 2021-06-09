import styled from 'styled-components';

const AlignFont = styled.span`
  .fonts-loaded & {
    transform: translateY(-${props => props.theme.fontVerticalOffset});
    display: inline-flex;
  }
`;

export default AlignFont;
