// eslint-data-component: intentionally omitted
import * as prismic from '@prismicio/client';
import { JSXFunctionSerializer, PrismicRichText } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import {
  defaultSerializer,
  withExternalLinkStripping,
} from '@weco/common/views/components/HTMLSerializers';

type Props = {
  html: prismic.RichTextField;
  htmlSerializer?: JSXFunctionSerializer;
};

const PrismicHtmlBlock: FunctionComponent<Props> = ({
  html,
  htmlSerializer,
}) => {
  const { isKiosk } = useKiosk();
  const baseSerializer = htmlSerializer ?? defaultSerializer;
  const serializer = isKiosk
    ? withExternalLinkStripping(baseSerializer)
    : baseSerializer;

  return (
    <PrismicRichText
      field={html}
      components={serializer}
      linkResolver={linkResolver}
    />
  );
};

export default PrismicHtmlBlock;
