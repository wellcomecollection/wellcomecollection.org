import type { HtmlSerialiser } from '../../../services/prismic/html-serialisers';
import type { HTMLString } from '../../../services/prismic/types';
import { RichText } from 'prismic-reactjs';

type Props = {|
  html: HTMLString,
  htmlSerialiser?: HtmlSerialiser,
|};

// TODO: use a 'z' for our spelling of htmlSerializer, for sanity?
const PrismicHtmlBlock = ({ html, htmlSerialiser }: Props) => (
  <RichText render={html} htmlSerializer={htmlSerialiser} />
);

export default PrismicHtmlBlock;
