import { FunctionComponent } from 'react';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import * as prismicT from '@prismicio/types';
import styled from 'styled-components';

const Wrapper = styled(Space).attrs({
  v: {
    size: 's',
    properties: ['margin-top'],
  },
  className: 'body-text',
})`
  p:first-of-type {
    margin: 0;
  }
`;

type Props = {
  html: prismicT.RichTextField;
};

const PageHeaderStandfirst: FunctionComponent<Props> = ({ html }) => (
  <Wrapper>
    <PrismicHtmlBlock html={html} />
  </Wrapper>
);

export default PageHeaderStandfirst;
