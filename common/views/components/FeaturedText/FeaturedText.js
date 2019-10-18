// @flow

import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { type HTMLString } from '../../../services/prismic/types';
import { type HtmlSerializer } from '../../../services/prismic/html-serialisers';
import { font, classNames } from '../../../utils/classnames';

type Props = {|
  html: HTMLString,
  htmlSerialiser?: HtmlSerializer,
|};

const FeaturedText = ({ html, htmlSerialiser }: Props) => (
  <div
    className={classNames({
      'body-text': true,
      [font('hnm', 3)]: true,
    })}
  >
    <PrismicHtmlBlock html={html} htmlSerialiser={htmlSerialiser} />
  </div>
);

export default FeaturedText;
