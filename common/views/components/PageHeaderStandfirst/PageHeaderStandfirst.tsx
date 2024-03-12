import { ComponentPropsWithoutRef, FunctionComponent } from 'react';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';

const Wrapper = styled(Space).attrs({
  className: 'body-text',
  $v: { size: 's', properties: ['margin-top'] },
})`
  p:first-of-type {
    margin: 0;
  }
`;

export type Props = ComponentPropsWithoutRef<typeof PrismicHtmlBlock>;

const PageHeaderStandfirst: FunctionComponent<Props> = props => (
  <Wrapper>
    <PrismicHtmlBlock {...props} />
  </Wrapper>
);

export default PageHeaderStandfirst;
