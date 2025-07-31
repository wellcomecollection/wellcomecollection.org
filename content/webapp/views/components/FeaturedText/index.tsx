import { ComponentPropsWithoutRef, FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';

type Props = ComponentPropsWithoutRef<typeof PrismicHtmlBlock>;

const FeaturedText: FunctionComponent<Props> = props => (
  <div className={`body-text ${font('intr', 4)}`} data-component="featured-text">
    <PrismicHtmlBlock {...props} />
  </div>
);

export default FeaturedText;
