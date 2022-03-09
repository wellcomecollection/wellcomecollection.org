import { HTMLString } from '../../../services/prismic/types';
import { linkResolver } from '../../../services/prismic/link-resolver';
import { JSXFunctionSerializer, PrismicRichText } from '@prismicio/react';
import * as prismicT from '@prismicio/types';

type Props = {
  html: HTMLString;
  htmlSerializer?: JSXFunctionSerializer;
};

const PrismicHtmlBlock = ({ html, htmlSerializer }: Props) => (
  <PrismicRichText
    field={html as prismicT.RichTextField}
    htmlSerializer={htmlSerializer}
    linkResolver={linkResolver}
  />
);

export default PrismicHtmlBlock;
