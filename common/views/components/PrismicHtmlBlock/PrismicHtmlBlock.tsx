import { HtmlSerializer } from '../../../services/prismic/html-serializers';
import { HTMLString } from '../../../services/prismic/types';
import { RichText, RichTextBlock } from 'prismic-reactjs';
import linkResolver from '../../../services/prismic/link-resolver';

type Props = {
  html: HTMLString;
  htmlSerializer?: HtmlSerializer;
};

const PrismicHtmlBlock = ({ html, htmlSerializer }: Props) => (
  <RichText
    render={html as RichTextBlock[]}
    htmlSerializer={htmlSerializer}
    linkResolver={linkResolver}
  />
);

export default PrismicHtmlBlock;
