import { font } from '@weco/common/utils/classnames';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { play } from '@weco/common/icons';

const WatchIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: ${props => props.theme.color('yellow')};
  border-radius: 50%;

  .icon {
    margin-left: 3px; /*  Make triangle appear centred in circle */
  }
`;

const WatchText = styled(Space).attrs({
  h: { size: 's', properties: ['margin-left'] },
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.700')};
`;

const Wrapper = styled.div.attrs({
  className: font('intr', 4),
})`
  display: flex;
  align-items: center;
`;

type Props = {
  text: string | ReactElement;
};

const WatchLabel: FunctionComponent<Props> = ({ text }) => (
  <Wrapper>
    <WatchIconWrapper>
      <Icon icon={play} matchText={true} />
    </WatchIconWrapper>
    <WatchText>{text}</WatchText>
  </Wrapper>
);
export default WatchLabel;
