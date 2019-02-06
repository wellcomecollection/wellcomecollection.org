// @flow

import { asHtml } from '../../../services/prismic/parsers';
import type { HtmlSerializer } from '../../../services/prismic/html-serialisers';
import type { HTMLString } from '../../../services/prismic/types';

type Props = {|
  html: HTMLString,
  htmlSerializer?: HtmlSerializer,
|};

// TODO: Find a way to not include the `<div>`
const PrismicHtmlBlock = ({ html, htmlSerializer }: Props) => (
  <span dangerouslySetInnerHTML={{ __html: asHtml(html, htmlSerializer) }} />
);

export default PrismicHtmlBlock;
