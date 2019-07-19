// @flow
import type { HTMLString } from '../../../services/prismic/types';
import { font, classNames, spacing } from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  text: HTMLString,
  citation: ?HTMLString,
  isPullOrReview: boolean,
|};

const Quote = ({ text, citation, isPullOrReview }: Props) => (
  <blockquote
    className={classNames({
      'quote--pull': isPullOrReview,
      [font({ s: 'HNL3', m: 'HNL2' })]: isPullOrReview,
      [spacing({ s: 3 }, { padding: ['left'] })]: true,
      'quote no-margin': true,
    })}
  >
    <VerticalSpace size={citation ? 'xs' : undefined}>
      <PrismicHtmlBlock html={text} />
    </VerticalSpace>
    {citation && (
      <footer className="quote__footer flex">
        <cite
          className={`quote__cite flex flex--v-end font-pewter ${font({
            s: 'HNL5',
            m: 'HNL4',
          })}`}
        >
          <PrismicHtmlBlock html={citation} />
        </cite>
      </footer>
    )}
  </blockquote>
);

export default Quote;
