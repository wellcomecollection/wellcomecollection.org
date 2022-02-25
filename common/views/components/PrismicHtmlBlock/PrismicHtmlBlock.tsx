import { HTMLString } from '../../../services/prismic/types';
import { HTMLSerializer, RichText, RichTextBlock } from 'prismic-reactjs';
import { ReactElement } from 'react';
import { linkResolver } from '../../../services/prismic/link-resolver';

type Props = {
  html: HTMLString;
  htmlSerializer?: HTMLSerializer<ReactElement>;
};

const PrismicHtmlBlock = ({ html, htmlSerializer }: Props) => (
  <RichText
    render={html as RichTextBlock[]}
    htmlSerializer={htmlSerializer}
    linkResolver={linkResolver}
  />
);

export default PrismicHtmlBlock;
