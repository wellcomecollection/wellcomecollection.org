// @flow

import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { type HTMLString } from '../../../services/prismic/types';
import { type HtmlSerializer } from '../../../services/prismic/html-serializers';
// $FlowFixMe (ts)
import { font, classNames } from '../../../utils/classnames';

type Props = {|
  html: HTMLString,
  htmlSerializer?: HtmlSerializer,
|};

const FeaturedText = ({ html, htmlSerializer }: Props) => (
  <div
    className={classNames({
      'body-text': true,
      [font('hnr', 4)]: true,
    })}
  >
    <PrismicHtmlBlock html={html} htmlSerializer={htmlSerializer} />
  </div>
);

export default FeaturedText;
