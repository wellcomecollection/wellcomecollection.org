import { FC } from 'react';
import { ArticleBasic } from '../../types/articles';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import { chevron } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

const Root = styled.div`
  position: absolute;
  z-index: 1;
  top: 200px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  pointer-events: none;

  ${props => props.theme.media.medium`
    top: 40%;
  `}
`;

const Link = styled.a<{ isNext: boolean }>`
  position: absolute;
  color: ${props => props.theme.color('charcoal')};
  left: ${props => (props.isNext ? undefined : 0)};
  right: ${props => (props.isNext ? 0 : undefined)};
  height: 80px;
  width: 340px;
  background: ${props => props.theme.color('cream')};
  overflow: hidden;
  border-radius: ${props => (props.isNext ? '6px 0 0 6px' : '0 6px 6px 0')};
  transition: transform ${props => props.theme.transitionProperties};
  transform: translateX(${props => (props.isNext ? '320px' : '-320px')});
  pointer-events: all;

  ${props => props.theme.media.medium`
    transform: translateX(${props => (props.isNext ? '300px' : '-300px')});
    height: 160px;

    &:hover,
    &:focus {
      transform: translateX(0);
    }
  `};
`;

const Inner = styled(Space).attrs({
  h: { size: 'xs', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})<{ isNext: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: ${props => (props.isNext ? 'row-reverse' : 'row')};
  width: 340px;
  position: absolute;
  right: ${props => (props.isNext ? undefined : 0)};
  left: ${props => (props.isNext ? 0 : undefined)};
  height: 100%;
`;

const TextWrap = styled.div<{ isNext: boolean }>`
  padding-left: ${props => (props.isNext ? '40px' : undefined)};
  padding-right: ${props => (props.isNext ? undefined : '40px')};
`;

const InSeries = styled(Space).attrs({
  v: { size: 's', properties: ['margin-bottom'] },
  className: font('intr', 3),
})``;

const Title = styled.div.attrs({
  className: font('intb', 2),
})`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Chevron = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top'] },
  className: font('intr', 1),
})<{ isNext: boolean }>`
  transform: translateX(${props => (props.isNext ? '-6px' : '6px')});

  ${props => props.theme.media.medium`
    transform: translateX(${props => (props.isNext ? '2px' : '-2px')});
  `}

  ${props => props.theme.media.large`
    transform: translateX(${props.isNext ? '-2px' : '2px'});
  `}
`;

export type Props = {
  previous?: ArticleBasic;
  next?: ArticleBasic;
};

const ComicPreviousNext: FC<Props> = ({ previous, next }) => {
  return (
    <Root>
      {previous && (
        <Link href={`/articles/${previous.id}`} isNext={false}>
          <Inner isNext={false}>
            <TextWrap isNext={false}>
              <InSeries>Previous in this series</InSeries>
              <Title>{previous.title}</Title>
            </TextWrap>
            <Chevron isNext={false}>
              <Icon icon={chevron} rotate={90} matchText={true} />
            </Chevron>
          </Inner>
        </Link>
      )}
      {next && (
        <Link href={`/articles/${next.id}`} isNext={true}>
          <Inner isNext={true}>
            <TextWrap isNext={true}>
              <InSeries>Next in this series</InSeries>
              <Title>{next.title}</Title>
            </TextWrap>
            <Chevron isNext={true}>
              <Icon icon={chevron} rotate={270} matchText={true} />
            </Chevron>
          </Inner>
        </Link>
      )}
    </Root>
  );
};

export default ComicPreviousNext;
