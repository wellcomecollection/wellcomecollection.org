import { linkResolver } from '../../../services/prismic/link-resolver';
import { JSXFunctionSerializer, PrismicRichText } from '@prismicio/react';
import * as prismicT from '@prismicio/types';

type Props = {
  html: prismicT.RichTextField;
  htmlSerializer?: JSXFunctionSerializer;
};

const PrismicHtmlBlock = ({ html, htmlSerializer }: Props) => (
  <PrismicRichText
    field={html}
    htmlSerializer={htmlSerializer}
    linkResolver={linkResolver}
  />
);

export default PrismicHtmlBlock;
