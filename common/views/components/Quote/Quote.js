// @flow
import { font, classNames, spacing } from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type { HTMLString } from '../../../services/prismic/types';

type Props = {|
  text: HTMLString,
  citation: ?HTMLString,
  isPullOrReview: boolean,
|};

const Quote = ({ text, citation, isPullOrReview }: Props) => (
  <blockquote
    className={classNames({
      quote: true,
      'quote--pull': isPullOrReview,
      [font('hnl', 2)]: isPullOrReview,
      [spacing({ s: 0 }, { margin: ['left', 'top', 'bottom'] })]: true,
    })}
  >
    <PrismicHtmlBlock html={text} />
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
