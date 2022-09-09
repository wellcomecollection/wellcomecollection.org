import { FunctionComponent } from 'react';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
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
    className="body-text first-para-no-margin"
  >
    <PrismicHtmlBlock html={html} />
  </Space>
);

export default PageHeaderStandfirst;
