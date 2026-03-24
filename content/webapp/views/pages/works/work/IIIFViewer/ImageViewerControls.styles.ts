import styled from 'styled-components';

export const ContrastSlider = styled.div`
  display: inline-flex;
  align-items: center;
  height: 46px;
  background: ${props => props.theme.color('white')};
  border-radius: 23px;
  padding-right: 10px;

  label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    cursor: pointer;

    .icon__shape {
      fill: ${props => props.theme.color('neutral.700')};
    }
  }

  input[type='range'] {
    width: 80px;
    margin: 0;
    cursor: pointer;
    accent-color: ${props => props.theme.color('yellow')};
  }
`;
