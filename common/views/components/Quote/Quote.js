// @flow
import type { HTMLString } from '../../../services/prismic/types';
import { font, classNames } from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '../styled/Space';

type Props = {|
  text: HTMLString,
  citation: ?HTMLString,
  isPullOrReview: boolean,
|};

const Quote = ({ text, citation, isPullOrReview }: Props) => (
  <blockquote
    className={classNames({
      'quote--pull': isPullOrReview,
      [font('hnl', 2)]: isPullOrReview,
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
            'hnl',
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
