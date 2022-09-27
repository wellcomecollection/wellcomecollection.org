import { FC } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import * as prismicT from '@prismicio/types';

export type Props = {
  text: prismicT.RichTextField;
  citation?: prismicT.RichTextField;
  isPullOrReview: boolean;
};

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
          <cite
            className={
              'quote__cite flex flex--v-end font-neutral-600' +
              ' ' +
              font('intr', 5)
            }
          >
            <PrismicHtmlBlock html={citation} />
          </cite>
        </footer>
      )}
    </blockquote>
  );
};

export default Quote;
