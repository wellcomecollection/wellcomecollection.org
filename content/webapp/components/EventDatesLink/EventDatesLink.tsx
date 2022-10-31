import { FunctionComponent } from 'react';
import { font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import { arrowSmall } from '@weco/common/icons';
import styled from 'styled-components';

type Props = {
  id: string;
};

const Wrapper = styled.a.attrs({
  className: font('intb', 5),
})`
  display: inline-flex;
  align-items: center;
`;

const EventDatesLink: FunctionComponent<Props> = ({ id }: Props) => (
  <Wrapper
    href="#dates"
    onClick={() => {
      trackEvent({
        category: 'EventDatesLink',
        action: 'follow link',
        label: id,
      });
    }}
  >
    <Icon icon={arrowSmall} iconColor="black" rotate={90} />
    <span>See all dates</span>
  </Wrapper>
);

export default EventDatesLink;
