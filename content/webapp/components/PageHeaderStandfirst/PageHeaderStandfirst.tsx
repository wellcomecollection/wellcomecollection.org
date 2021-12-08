import { FunctionComponent } from 'react';
import { HTMLString } from '@weco/common/services/prismic/types';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

type Props = { html: HTMLString };

const PageHeaderStandfirst: FunctionComponent<Props> = ({ html }: Props) => (
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
