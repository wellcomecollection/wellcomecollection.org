import { FC } from 'react';
import { ArticleBasic } from '../../types/articles';
import styled from 'styled-components';

const Root = styled.div<{ hasPrevious: boolean; hasNext: boolean }>`
  position: absolute;
  display: flex;
  top: 50%;
  justify-content: ${({ hasPrevious, hasNext }) =>
    hasPrevious && hasNext
      ? 'space-between'
      : hasPrevious
      ? 'flext-start'
      : 'flex-end'};
  left: 0;
  right: 0;
  transform: translateY(-50%);
`;

const LinkWrap = styled.div<{ isNext: boolean }>`
  background: hotpink;
`;

export type Props = {
  previous?: ArticleBasic;
  next?: ArticleBasic;
};

const ComicPreviousNext: FC<Props> = ({ previous, next }) => {
  return (
    <Root hasPrevious={Boolean(previous)} hasNext={Boolean(next)}>
      {previous && (
        <LinkWrap isNext={false}>
          <a href={`/articles/${previous.id}`}>{previous.title}</a>
        </LinkWrap>
      )}
      {next && (
        <LinkWrap isNext={true}>
          <a href={`/articles/${next.id}`}>{next.title}</a>
        </LinkWrap>
      )}
    </Root>
  );
};

export default ComicPreviousNext;
