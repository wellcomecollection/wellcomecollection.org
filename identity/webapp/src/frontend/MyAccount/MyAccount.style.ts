import styled, { css } from 'styled-components';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { Container as LayoutContainer } from '../components/Layout.style';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

export const ProgressBar = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  background-color: ${props => props.theme.color('white')};
  border-radius: 7px; /* (height of inner div) / 2 + padding */
  border: 2px solid black;
  width: 300px;
  max-width: 100%;
`;

export const ProgressIndicator = styled.div<{ percentage: number }>`
  background-color: ${props => props.theme.color('black')};
  width: ${props => `${props.percentage}%`};
  height: 10px;
`;

export const Container = styled(LayoutContainer)`
  max-width: 1024px;
`;

export const Wrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})``;

const OutlinedDangerButtonModifier = css`
  color: #d1192c;
  border-color: #d1192c;

  &:not([disabled]):hover {
    color: #b80013;
    border-color: #b80013;
  }
`;

export const Button = styled(ButtonOutlined)<{ isDangerous?: boolean }>`
  justify-content: center;

  ${props => props.isDangerous && OutlinedDangerButtonModifier}
`;

export const ModalContainer = styled.aside`
  @media screen and (min-width: 600px) {
    width: 24em;
  }
`;

export const TruncateTitle = styled.a`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 60ch;
`

export const ModalTitle = styled.h2.attrs({ className: font('wb', 3) })``;

const colours = {
  success: css`
    background-color: rgba(0, 120, 108, 0.1);
    border: 1px solid rgba(0, 120, 108, 0.3);
    color: ${props => props.theme.color('green')};
  `,
  failure: css`
    background-color: rgba(224, 27, 47, 0.1);
    border: 1px solid rgba(224, 27, 47, 0.3);
    color: #d1192c;
  `,
  info: css`
    background-color: rgba(255, 206, 60, 0.2);
    border: 1px solid rgba(255, 206, 60, 0.4);
    color: #705400;
  `,
};

export const StatusAlert = styled(Space).attrs({
  role: 'alert',
  v: { size: 'l', properties: ['margin-bottom'] },
})<{ type: keyof typeof colours }>`
  ${props => colours[props.type]}
  padding: 1em;
  border-radius: 6px;
  padding-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const Section = styled.section`
  border-top: 1px solid ${props => props.theme.color('pumice')};
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

export const SectionHeading = styled(Space).attrs({
  as: 'h2',
  v: { size: 'm', properties: ['padding-bottom'] },
  className: font('wb', 3),
})`
  font-weight: bold;
`;

export const StyledDl = styled(Space).attrs({
  as: 'dl',
  v: {
    size: 'l',
    properties: ['margin-bottom'],
  },
})`
  margin-top: 0;
`;

export const StyledDd = styled(Space).attrs({
  as: 'dd',
  v: {
    size: 'm',
    properties: ['margin-bottom'],
  },
})`
  margin-left: 0;
`;
