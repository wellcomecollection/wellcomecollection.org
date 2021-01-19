import { font, classNames } from '../../../utils/classnames';
import styled from 'styled-components';

export const WatchWrapper = styled.div`
  display: inline-block;
  position: relative;
  padding-left: 36px;
  line-height: 36px;

  ::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    background: ${props => props.theme.color('yellow')};
    border-radius: 50%;
    width: 36px;
    height: 36px;
  }
  ::after {
    content: '';
    position: absolute;
    left: 20px;
    top: 18px;
    transform: translateX(-50%) translateY(-50%);
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-left: 12px solid ${props => props.theme.color('black')};
  }
`;

export const WatchText = styled.div.attrs({
  className: classNames({
    [font('hnl', 6)]: true,
  }),
})`
  color: ${props => props.theme.color('pewter')};
`;
