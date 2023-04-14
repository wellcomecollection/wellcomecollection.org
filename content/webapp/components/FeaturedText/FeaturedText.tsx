import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { font } from '@weco/common/utils/classnames';
import { FunctionComponent, ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<typeof PrismicHtmlBlock>;

const FeaturedText: FunctionComponent<Props> = props => (
  <div className={`body-text ${font('intr', 4)}`}>
    <PrismicHtmlBlock {...props} />
  </div>
);

export default FeaturedText;
