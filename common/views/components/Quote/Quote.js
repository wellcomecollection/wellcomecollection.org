// @flow
import {font} from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  text: HTMLString,
  citation: ?HTMLString
|}

const Quote = ({text, citation}: Props) => (
  <blockquote
    className={`quote quote--block ${font({s: 'HNL3'})}`}>
    <PrismicHtmlBlock html={text} />

    {citation &&
      <footer className='quote__footer flex'>
        <cite className={`quote__cite flex flex--v-end ${font({s: 'HNL5'})}`}>
          <PrismicHtmlBlock html={citation} />
        </cite>
      </footer>
    }
  </blockquote>
);

export default Quote;
