import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { font, classNames } from '@weco/common/utils/classnames';
import { JSXFunctionSerializer } from '@prismicio/react';
import * as prismicT from '@prismicio/types';
import { FC } from 'react';

type Props = {
  html: prismicT.RichTextField;
  htmlSerializer?: JSXFunctionSerializer;
};

const FeaturedText: FC<Props> = ({ html, htmlSerializer }: Props) => (
  <div
    className={classNames({
      'body-text': true,
      [font('intr', 4)]: true,
    })}
  >
    <PrismicHtmlBlock html={html} htmlSerializer={htmlSerializer} />
  </div>
);

export default FeaturedText;
