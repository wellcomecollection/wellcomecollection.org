import {asHtml} from '../../../services/prismic/parsers';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  html: HTMLString
|}

// TODO: Find a way to not include the `<div>`
const PrismicHtmlBlock = ({html}: Props) => (
  <div dangerouslySetInnerHTML={{__html: asHtml(html)}} />
);

export default PrismicHtmlBlock;
