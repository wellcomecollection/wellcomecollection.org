// @flow
import {font, classNames, spacing} from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  text: HTMLString,
  citation: ?HTMLString,
  isPullOrReview: boolean
|}

const Quote = ({text, citation, isPullOrReview}: Props) => (
  <blockquote
    className={classNames({
      'quote': true,
      'quote--pull': isPullOrReview,
      [font({s: 'HNL3', m: 'HNL2'})]: isPullOrReview,
      [spacing({s: 3}, {padding: ['left']})]: true,
      [spacing({s: 0}, {margin: ['left', 'top', 'bottom']})]: true
    })}>
    <PrismicHtmlBlock html={text} />
    {citation &&
      <footer className='quote__footer flex'>
        <cite className={`quote__cite flex flex--v-end font-pewter ${font({s: 'HNL5', m: 'HNL4'})}`}>
          <PrismicHtmlBlock html={citation} />
        </cite>
      </footer>
    }
  </blockquote>
);

export default Quote;
