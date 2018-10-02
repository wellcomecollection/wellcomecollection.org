// @flow
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import {classNames, spacing} from '../../../utils/classnames';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {html: HTMLString}
const PageHeaderStandfirst = ({html}: Props) => (
  <div className={classNames({
    'first-para-no-margin': true,
    [spacing({s: 1}, {margin: ['top']})]: true
  })}>
    <PrismicHtmlBlock html={html} />
  </div>
);

export default PageHeaderStandfirst;
