import { ComponentPropsWithoutRef, FunctionComponent } from 'react';
import styled from 'styled-components';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import { createSerializer } from '@weco/common/views/components/HTMLSerializers';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';

const Wrapper = styled(Space).attrs({
  className: 'body-text',
  $v: { size: 'xs', properties: ['margin-top'] },
})`
  p:first-of-type {
    margin: 0;
  }
`;

export type Props = ComponentPropsWithoutRef<typeof PrismicHtmlBlock>;

const PageHeaderStandfirst: FunctionComponent<Props> = props => {
  const isKiosk = useKiosk();

  return (
    <Wrapper data-component="page-header-standfirst">
      <PrismicHtmlBlock
        {...props}
        htmlSerializer={
          props.htmlSerializer ||
          createSerializer({ stripExternalLinks: isKiosk })
        }
      />
    </Wrapper>
  );
};

export default PageHeaderStandfirst;
