import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { arrowSmall } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';

const Wrapper = styled.a.attrs({
  className: font('intb', 5),
})`
  display: inline-flex;
  align-items: center;
`;

const EventDatesLink: FunctionComponent = () => (
  <Wrapper href="#dates">
    <Icon icon={arrowSmall} iconColor="black" rotate={90} />
    <span>See all dates</span>
  </Wrapper>
);

export default EventDatesLink;
