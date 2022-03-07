import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { HTMLString } from '@weco/common/services/prismic/types';
import { font, classNames } from '@weco/common/utils/classnames';
import { HTMLSerializer } from 'prismic-reactjs';
import { ReactElement } from 'react';

type Props = {
  html: HTMLString;
  htmlSerializer?: HTMLSerializer<ReactElement>;
};

const FeaturedText = ({ html, htmlSerializer }: Props) => (
  <div
    className={classNames({
      'body-text': true,
      [font('hnr', 4)]: true,
    })}
  >
    <PrismicHtmlBlock html={html} htmlSerializer={htmlSerializer} />
  </div>
);

export default FeaturedText;
