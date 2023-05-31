import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';

export const PrototypeH1 = styled.h1.attrs({ className: 'h0' })``;

export const TwoUp = styled.div`
  display: grid;
  grid-gap: 50px;

  ${props => props.theme.media('medium')`
    grid-template-columns: 1fr 1fr;
  `}
`;

export const YellowBox = styled(Space).attrs({
  h: {
    size: 'l',
    properties: ['margin-left', 'margin-right'],
    negative: true,
  },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('lightYellow')};

  ${props =>
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
        margin: 0;
    `)}
`;

export const YellowBoxInner = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})``;

export const NoSpacedText = styled.div`
  & * + * {
    margin-top: revert !important; /* TODO: sack me */
  }
`;

export const BigIcon = styled.div`
  font-size: 6rem;
  line-height: 0;
`;

export const TODO = styled.p`
  background-color: yellow;
  padding: 2px;
  font-family: 'Comic Sans MS'; /* stylelint-disable-line font-family-no-missing-generic-family-keyword */

  &::before {
    content: 'TODO: ';
  }
`;

// V2

export const Flex = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top'] },
})`
  display: flex;
  align-items: flex-start;
`;

export const Division = styled(Flex).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})<{ borderColor?: 'black' }>`
  border-bottom: 1px solid
    ${props => props.theme.color(props.borderColor || 'warmNeutral.400')};
`;

export const LeftHandSide = styled(Space).attrs({
  h: { size: 'l', properties: ['margin-right'] },
})`
  flex: 1 1 50%;
`;

export const RightHandSide = styled(Space).attrs({
  h: { size: 'l', properties: ['margin-left'] },
})`
  flex: 1 1 50%;
`;

export const PrototypeH2 = styled(Space).attrs<{ isFirst?: boolean }>({
  as: 'h2',
  classNames: 'h2',
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
