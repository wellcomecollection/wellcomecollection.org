import { asHtml } from '../../../services/prismic/parsers';
import type { HtmlSerialiser } from '../../../services/prismic/html-serialisers';
import type { HTMLString } from '../../../services/prismic/types';
import parse from 'html-react-parser';

type Props = {|
  html: HTMLString,
  htmlSerialiser?: HtmlSerialiser,
|};

const PrismicHtmlBlock = ({ html, htmlSerialiser }: Props) =>
  html.length > 0 && parse(`${asHtml(html, htmlSerialiser)}`);

export default PrismicHtmlBlock;
