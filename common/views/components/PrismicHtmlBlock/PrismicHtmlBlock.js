// @flow

import type { HtmlSerializer } from '../../../services/prismic/html-serializers';
import type { HTMLString } from '../../../services/prismic/types';
import { RichText } from 'prismic-reactjs';

type Props = {|
  html: HTMLString,
  htmlSerializer?: HtmlSerializer,
|};

const PrismicHtmlBlock = ({ html, htmlSerializer }: Props) => (
  <RichText render={html} htmlSerializer={htmlSerializer} />
);

export default PrismicHtmlBlock;
