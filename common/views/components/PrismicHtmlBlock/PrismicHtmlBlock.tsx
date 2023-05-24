import linkResolver from '@weco/common/services/prismic/link-resolver';
import { JSXFunctionSerializer, PrismicRichText } from '@prismicio/react';
import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';

type Props = {
  html: prismic.RichTextField;
  htmlSerializer?: JSXFunctionSerializer;
};

const PrismicHtmlBlock: FunctionComponent<Props> = ({
  html,
  htmlSerializer,
}) => (
  <PrismicRichText
    field={html}
    components={htmlSerializer}
    linkResolver={linkResolver}
  />
);

export default PrismicHtmlBlock;
