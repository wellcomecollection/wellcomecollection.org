import { FunctionComponent } from 'react';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import * as prismicT from '@prismicio/types';

type Props = {
  html: prismicT.RichTextField;
};

const PageHeaderStandfirst: FunctionComponent<Props> = ({ html }: Props) => (
  <Space
    v={{
      size: 's',
      properties: ['margin-top'],
    }}
    className={classNames({
      [font('hnr', 3)]: true,
      'body-text': true,
      'first-para-no-margin': true,
    })}
  >
    <PrismicHtmlBlock html={html} />
  </Space>
);

export default PageHeaderStandfirst;
