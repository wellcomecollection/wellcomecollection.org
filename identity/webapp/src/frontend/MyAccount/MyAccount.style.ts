import styled, { css } from 'styled-components';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { Container as LayoutContainer } from '../components/Layout.style';

export const Container = styled(LayoutContainer)`
  max-width: 1024px;
`;

export const Wrapper = styled.div`
  max-width: 48em;
  margin: 0 auto;
  padding: 1em;

  @media screen and (min-width: 600px) {
    padding: 1em 2em;
  }
`;

export const DetailWrapper = styled.dl`
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const DetailLabel = styled.dt.attrs({ className: 'font-hnl fonts-loaded font-size-4' })`
  display: block;
  font-weight: bold;
`;

export const DetailValue = styled.dd`
  margin: 0;
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
    grid-template-columns: 3fr 2fr;
  }

  & > h2 {
    grid-column: 1 / -1;
  }
`;

export const SectionHeading = styled.h2.attrs({ className: 'font-hnl fonts-loaded font-size-3' })`
  font-weight: bold;
  margin: 0;
`;
