import {asHtml} from '../../../services/prismic/parsers';
import linkResolver from '../../../services/prismic/link-resolver';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  html: HTMLString
|}

// TODO: Find a way to not include the `<div>`
const PrismicHtmlBlock = ({html}: Props) => (
  <span dangerouslySetInnerHTML={{__html: asHtml(html, linkResolver)}} />
);

export default PrismicHtmlBlock;
