import { FunctionComponent } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import * as prismicT from '@prismicio/types';
import styled from 'styled-components';

export type Props = {
  text: prismicT.RichTextField;
  citation?: prismicT.RichTextField;
  isPullOrReview: boolean;
};

const Blockquote = styled.blockquote.attrs<{ isPullOrReview: boolean }>(
  props => ({
    className: classNames({
      'quote--pull': props.isPullOrReview,
      [font('intr', 2)]: props.isPullOrReview,
      quote: true,
    }),
  })
)<{ isPullOrReview: boolean }>`
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
    <Blockquote isPullOrReview={isPullOrReview}>
      <Space
        v={citation ? { size: 'xs', properties: ['margin-bottom'] } : undefined}
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
