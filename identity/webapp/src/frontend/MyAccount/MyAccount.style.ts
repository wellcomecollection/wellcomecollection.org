import styled, { css } from 'styled-components';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

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

const OutlinedDangerButtonModifier = css`
  color: #d1192c;
  border-color: #d1192c;

  &:not([disabled]):hover {
    color: #b80013;
    border-color: #b80013;
  }
`;

export const Button = styled(OutlinedButton)`
  width: 100%;
  justify-content: center;
  height: 55px;

  ${props => props.isDangerous && OutlinedDangerButtonModifier}
`;

export const ModalContainer = styled.aside`
  @media screen and (min-width: 600px) {
    width: 24em;
  }
`;

export const ModalTitle = styled.h2.attrs({ className: 'font-wb font-size-3' })``;

export const StatusAlert = styled.div.attrs({ role: 'alert' })`
  padding: 1em;
  background-color: rgba(0, 120, 108, 0.1);
  color: #00786c;
  border-radius: 6px;
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;
