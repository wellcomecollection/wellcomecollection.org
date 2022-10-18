import { FC } from 'react';
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

const Cite = styled.cite.attrs({
  className: `quote__cite ${font('intr', 5)}`,
})`
  color: ${props => props.theme.color('neutral.600')};
  display: flex;
  align-items: flex-end;
`;

const Quote: FC<Props> = ({ text, citation, isPullOrReview }) => {
  return (
    <blockquote
      className={classNames({
        'quote--pull': isPullOrReview,
        [font('intr', 2)]: isPullOrReview,
        'quote no-margin': true,
      })}
    >
      <Space
        v={citation ? { size: 'xs', properties: ['margin-bottom'] } : undefined}
      >
        <PrismicHtmlBlock html={text} />
      </Space>
      {citation && (
        <footer className="quote__footer flex">
          <Cite>
            <PrismicHtmlBlock html={citation} />
          </Cite>
        </footer>
      )}
    </blockquote>
  );
};

export default Quote;
