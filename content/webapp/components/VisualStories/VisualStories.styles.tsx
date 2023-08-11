import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

export const PrototypeH1 = styled.h1.attrs({ className: font('wb', 1) })``;

export const TwoUp = styled.div`
  display: grid;
  grid-gap: 50px;

  ${props => props.theme.media('medium')`
    grid-template-columns: 1fr 1fr;
  `}
`;

export const NoSpacedText = styled.div`
  & * + * {
    margin-top: revert !important; /* TODO: sack me */
  }
`;

export const InfoBlock = styled(Space).attrs<{ hasBorder?: boolean }>(
  props => ({
    v: {
      size: 'l',
      properties: ['padding-top', props.hasBorder ? 'padding-bottom' : ''],
    },
  })
)<{ hasBorder?: boolean; borderColor?: 'black' }>`
  display: flex;
  flex-direction: column-reverse;
  gap: 32px;

  ${props => props.theme.media('medium')`
    align-items: flex-start;
    flex-direction: row;
  `}

  ${props =>
    props.hasBorder
      ? `border-bottom: 1px solid
    ${props.theme.color(props.borderColor || 'warmNeutral.400')}`
      : null};

  & > div {
    flex-basis: 50%;

    &:nth-child(2) {
      text-align: center;
    }
  }
`;

export const PrototypeH2 = styled(Space).attrs<{ isFirst?: boolean }>({
  as: 'h2',
  classNames: font('wb', 3),
  v: { size: 'l', properties: ['padding-top'] },
})<{ isFirst?: boolean }>`
  border-top: 1px solid ${props => props.theme.color('neutral.400')};

  ${props =>
    props.isFirst &&
    `
    border-top: 0;
  `}

  ${props => props.theme.media('medium')`
    border-top: 0;
  `}
`;
