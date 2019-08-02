// @flow
import type { HTMLString } from '../../../services/prismic/types';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { classNames } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

type Props = { html: HTMLString };
const PageHeaderStandfirst = ({ html }: Props) => (
  <VerticalSpace
    v={{
      size: 's',
      properties: ['margin-top'],
    }}
    className={classNames({
      'body-text': true,
      'first-para-no-margin': true,
    })}
  >
    <PrismicHtmlBlock html={html} />
  </VerticalSpace>
);

export default PageHeaderStandfirst;
