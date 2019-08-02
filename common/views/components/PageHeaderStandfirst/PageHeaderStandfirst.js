// @flow
import type { HTMLString } from '../../../services/prismic/types';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';

type Props = { html: HTMLString };
const PageHeaderStandfirst = ({ html }: Props) => (
  <Space
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
  </Space>
);

export default PageHeaderStandfirst;
