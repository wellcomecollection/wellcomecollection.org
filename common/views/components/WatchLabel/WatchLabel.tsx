import { classNames, font } from '../../../../common/utils/classnames';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';

const WatchIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: ${props => props.theme.color('yellow')};
  border-radius: 50%;

  .icon {
    margin-left: 3px; // Make triangle appear centred in circle
  }
`;

const WatchText = styled(Space).attrs({
  v: { size: 's', properties: ['margin-left'] },
  className: classNames({
    [font('hnr', 6)]: true,
  }),
})`
  color: ${props => props.theme.color('pewter')};
`;

type Props = {
  text?: string | ReactElement;
};

const WatchLabel: FunctionComponent<Props> = ({ text }: Props) => (
  <div
    className={classNames({
      [font('hnr', 4)]: true,
      'flex flex--v-center': true,
    })}
  >
    <WatchIconWrapper>
      <Icon name={`play`} matchText={true} />
    </WatchIconWrapper>
    {text && <WatchText>{text}</WatchText>}
  </div>
);
export default WatchLabel;
