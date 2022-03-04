import { HTMLString } from '@weco/common/services/prismic/types';
import { font, classNames } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';

export type Props = {
  text: HTMLString;
  citation?: HTMLString;
  isPullOrReview: boolean;
};

const Quote = ({ text, citation, isPullOrReview }: Props) => (
  <blockquote
    className={classNames({
      'quote--pull': isPullOrReview,
      [font('hnr', 2)]: isPullOrReview,
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
          className={`quote__cite flex flex--v-end font-pewter ${font(
            'hnr',
            5
          )}`}
        >
          <PrismicHtmlBlock html={citation} />
        </cite>
      </footer>
    )}
  </blockquote>
);

export default Quote;
