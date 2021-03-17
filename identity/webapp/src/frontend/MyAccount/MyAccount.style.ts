import styled, { css } from 'styled-components';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

export const Wrapper = styled.div`
  max-width: 48em;
  margin: 0 auto;
  padding: 1em;

  @media screen and (min-width: 600px) {
    padding: 1em 2em;
  }
`;

export const DetailWrapper = styled.figure`
  margin: 0;
`;

export const Label = styled.figcaption.attrs({ className: 'font-hnl fonts-loaded font-size-4' })`
  display: block;
  font-weight: bold;
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

export const Section = styled.section.attrs({ className: 'border-top-width-1 border-color-pumice' })`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1em;
  align-items: center;
  padding: 1em 0;

  @media screen and (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }

  & > h2 {
    grid-column: 1 / -1;
  }
`;

export const SectionHeading = styled.h2.attrs({ className: 'font-hnl fonts-loaded font-size-3' })`
  font-weight: bold;
  margin: 0;
`;
