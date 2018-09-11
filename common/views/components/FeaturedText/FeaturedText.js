import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';

// @flow
import {font, classNames} from '../../../utils/classnames';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  html: HTMLString
|}

const FeaturedText = ({html}: Props) => (
  <div className={classNames({
    'body-text': true,
    [font({s: 'HNM4', m: 'HNM3'})]: true
  })}>
    <PrismicHtmlBlock html={html} />
  </div>
);

export default FeaturedText;
