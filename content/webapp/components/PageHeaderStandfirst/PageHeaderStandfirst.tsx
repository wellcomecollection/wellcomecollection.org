import { ComponentPropsWithoutRef, FunctionComponent } from 'react';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
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

type Props = ComponentPropsWithoutRef<typeof PrismicHtmlBlock>;

const PageHeaderStandfirst: FunctionComponent<Props> = props => (
  <Wrapper>
    <PrismicHtmlBlock {...props} />
  </Wrapper>
);

export default PageHeaderStandfirst;
