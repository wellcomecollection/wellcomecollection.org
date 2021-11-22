// @flow
import type { HTMLString } from '@weco/common/services/prismic/types';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
// $FlowFixMe (ts)
import { classNames } from '@weco/common/utils/classnames';
// $FlowFixMe (tsx)
import Space from '@weco/common/views/components/styled/Space';

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
