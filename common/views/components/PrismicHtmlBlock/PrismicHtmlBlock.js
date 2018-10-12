import {asHtml} from '../../../services/prismic/parsers';
import type {HtmlSerialiser} from '../../../services/prismic/html-serialisers';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  html: HTMLString,
  htmlSerialiser?: HtmlSerialiser
|}

// TODO: Find a way to not include the `<div>`
const PrismicHtmlBlock = ({
  html,
  htmlSerialiser
}: Props) => (
  <span dangerouslySetInnerHTML={{__html: asHtml(html, htmlSerialiser)}} />
);

export default PrismicHtmlBlock;
