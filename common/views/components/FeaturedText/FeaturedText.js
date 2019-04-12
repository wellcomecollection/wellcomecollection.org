import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type { HtmlSerialiser } from '../../../services/prismic/html-serialisers';

// @flow
import { font, classNames } from '../../../utils/classnames';
import type { HTMLString } from '../../../services/prismic/types';

type Props = {|
  html: HTMLString,
  htmlSerialiser?: HtmlSerialiser,
|};

const FeaturedText = ({ html, htmlSerialiser }: Props) => (
  <div
    className={classNames({
      'body-text': true,
      [font({ s: 'HNM4', m: 'HNM3' })]: true,
    })}
  >
    <PrismicHtmlBlock html={html} htmlSerialiser={htmlSerialiser} />
  </div>
);

export default FeaturedText;
