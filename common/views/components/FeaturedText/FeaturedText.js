// @flow

import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { type HTMLString } from '../../../services/prismic/types';
import { type HtmlSerializer } from '../../../services/prismic/html-serializers';
import { font, classNames } from '../../../utils/classnames';

type Props = {|
  html: HTMLString,
  htmlSerializer?: HtmlSerializer,
|};

const FeaturedText = ({ html, htmlSerializer }: Props) => (
  <div
    className={classNames({
      'body-text': true,
      [font('hnm', 3)]: true,
    })}
  >
    <PrismicHtmlBlock html={html} htmlSerializer={htmlSerializer} />
  </div>
);

export default FeaturedText;
