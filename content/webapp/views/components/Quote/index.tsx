import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { classNames, font } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';

export type Props = {
  text: prismic.RichTextField;
  citation?: prismic.RichTextField;
  isPullOrReview: boolean;
};

const Blockquote = styled.blockquote.attrs<{ $isPullOrReview: boolean }>(
  props => ({
    className: classNames({
      'quote--pull': props.$isPullOrReview,
      [font('intr', 2)]: props.$isPullOrReview,
      quote: true,
    }),
  })
)`
  margin: 0;
`;

const Cite = styled.cite.attrs({
  className: `quote__cite ${font('intr', 5)}`,
})`
  color: ${props => props.theme.color('neutral.600')};
  display: flex;
  align-items: flex-end;
`;

const Quote: FunctionComponent<Props> = ({
  text,
  citation,
  isPullOrReview,
}) => {
  return (
    <Blockquote $isPullOrReview={isPullOrReview} data-component="quote">
      <Space
        $v={
          citation ? { size: 'xs', properties: ['margin-bottom'] } : undefined
        }
      >
        <PrismicHtmlBlock html={text} />
      </Space>
      {citation && (
        <footer style={{ display: 'flex' }}>
          <Cite>
            <PrismicHtmlBlock html={citation} />
          </Cite>
        </footer>
      )}
    </Blockquote>
  );
};

export default Quote;
