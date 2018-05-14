import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';

// @flow
import {spacing, font} from '../../../utils/classnames';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  html: HTMLString
|}

const FeaturedText = ({html}: Props) => (
  <div className={`
    body-text
    border-left-width-5
    border-color-black
    ${spacing({s: 4}, {padding: ['left']})}
    ${font({s: 'HNL3', m: 'HNL2'})}
  `}>
    <PrismicHtmlBlock html={html} />
  </div>
);

export default FeaturedText;
