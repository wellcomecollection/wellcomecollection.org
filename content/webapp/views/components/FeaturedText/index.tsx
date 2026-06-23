import { ComponentPropsWithoutRef, FunctionComponent } from 'react';

import { typography } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';

type Props = ComponentPropsWithoutRef<typeof PrismicHtmlBlock>;

const FeaturedText: FunctionComponent<Props> = props => (
  <div
    data-component="featured-text"
    className={`body-text ${typography('body', 'lg', 'regular')}`}
  >
    <PrismicHtmlBlock {...props} />
  </div>
);

export default FeaturedText;
