// @flow
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import {classNames, spacing} from '../../../utils/classnames';
import type {HTMLString} from '../../../services/prismic/types';

const PageHeaderStandfirst = (html: HTMLString) => (
  <div className={classNames({
    'first-para-no-margin': true,
    [spacing({s: 1}, {margin: ['top']})]: true
  })}>
    <PrismicHtmlBlock html={html} />
  </div>
);

export default PageHeaderStandfirst;
