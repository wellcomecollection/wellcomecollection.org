import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { chevron } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { ArticleBasic } from '@weco/content/types/articles';

const Root = styled.div`
  position: absolute;
  z-index: 1;
  top: 200px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  pointer-events: none;

  ${props => props.theme.media('medium')`
    top: 40%;
  `}
`;

type LinkProps = { 'data-gtm-trigger'?: 'comic_prev_next_link' };
const Link = styled.a.attrs<LinkProps>({
  'data-gtm-trigger': 'comic_prev_next_link',
})<{ $isNext: boolean }>`
  position: absolute;
  color: ${props => props.theme.color('neutral.700')};
  left: ${props => (props.$isNext ? undefined : 0)};
  right: ${props => (props.$isNext ? 0 : undefined)};
  height: 80px;
  width: 360px;
  background: ${props => props.theme.color('warmNeutral.300')};
  overflow: hidden;
  border-radius: ${props => (props.$isNext ? '6px 0 0 6px' : '0 6px 6px 0')};
  transition: transform ${props => props.theme.transitionProperties};
  transform: translateX(${props => (props.$isNext ? '340px' : '-340px')});
  pointer-events: all;

  ${props =>
    props.theme.media('medium')(`
      transform: translateX(${props.$isNext ? '320px' : '-320px'});
      height: 160px;

      &:hover,
      &:focus {
        transform: translateX(0);
      }
    `)};
`;

const Inner = styled(Space).attrs({
  $h: { size: 'xs', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})<{ $isNext: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: ${props => (props.$isNext ? 'row-reverse' : 'row')};
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
`;

const TextWrap = styled.div<{ $isNext: boolean }>`
  width: 300px;
  padding-left: ${props => (props.$isNext ? '10px' : undefined)};
  padding-right: ${props => (props.$isNext ? undefined : '10px')};
`;

const InSeries = styled(Space).attrs({
  className: font('intr', 0),
  $v: { size: 's', properties: ['margin-bottom'] },
})``;

const Title = styled.div.attrs({
  className: font('intsb', 1),
})`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Chevron = styled(Space).attrs({
  className: font('intr', 0),
  $v: { size: 'm', properties: ['padding-top'] },
})<{ $isNext: boolean }>`
  transform: translateX(${props => (props.$isNext ? '-6px' : '6px')});

  ${props =>
    props.theme.media('medium')(`
      transform: translateX(${props.$isNext ? '2px' : '-2px'});
    `)}

  ${props =>
    props.theme.media('large')(`
      transform: translateX(${props.$isNext ? '-2px' : '2px'});
    `)}
`;

export type Props = {
  previous?: ArticleBasic;
  next?: ArticleBasic;
};

const ComicPreviousNext: FunctionComponent<Props> = ({ previous, next }) => {
  return (
    <Root data-component="comic-previous-next">
      {previous && (
        <Link href={`/articles/${previous.id}`} $isNext={false}>
          <Inner $isNext={false}>
            <TextWrap $isNext={false}>
              <InSeries>Previous in this series</InSeries>
              <Title>{previous.title}</Title>
            </TextWrap>
            <Chevron $isNext={false}>
              <Icon icon={chevron} rotate={90} matchText={true} />
            </Chevron>
          </Inner>
        </Link>
      )}
      {next && (
        <Link href={`/articles/${next.id}`} $isNext={true}>
          <Inner $isNext={true}>
            <TextWrap $isNext={true}>
              <InSeries>Next in this series</InSeries>
              <Title>{next.title}</Title>
            </TextWrap>
            <Chevron $isNext={true}>
              <Icon icon={chevron} rotate={270} matchText={true} />
            </Chevron>
          </Inner>
        </Link>
      )}
    </Root>
  );
};

export default ComicPreviousNext;
