import styled from 'styled-components';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { DangerButtonModifier } from '../components/Form.style';

export const Grid = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1em;

  @media screen and (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const DetailWrapper = styled.figure`
  margin: 0;
`;

export const Label = styled.figcaption.attrs({ className: 'font-hnl fonts-loaded font-size-4' })`
  display: block;
  font-weight: bold;
`;

export const HorizontalRule = styled.hr`
  grid-column: 1 / -1;
`;

export const Button = styled(SolidButton)`
  width: 100%;
  justify-content: center;
  height: 55px;

  ${props => props.isDangerous && DangerButtonModifier}
`;

export const ModalContainer = styled.aside`
  @media screen and (min-width: 600px) {
    width: 24em;
  }
`;

export const ModalTitle = styled.h2.attrs({ className: 'font-wb font-size-3' })``;
