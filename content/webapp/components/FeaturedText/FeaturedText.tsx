import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { font } from '@weco/common/utils/classnames';
import { JSXFunctionSerializer } from '@prismicio/react';
import * as prismicT from '@prismicio/types';
import { FunctionComponent } from 'react';

type Props = {
  html: prismicT.RichTextField;
  htmlSerializer?: JSXFunctionSerializer;
};

const FeaturedText: FunctionComponent<Props> = ({
  html,
  htmlSerializer,
}: Props) => (
  <div className={`body-text ${font('intr', 4)}`}>
    <PrismicHtmlBlock html={html} htmlSerializer={htmlSerializer} />
  </div>
);

export default FeaturedText;
