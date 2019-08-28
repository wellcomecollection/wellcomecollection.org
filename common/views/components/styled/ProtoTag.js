import styled from 'styled-components';
import { font, classNames } from '../../../utils/classnames';

const ProtoTag = styled.div.attrs(props => ({
  className: classNames({
    [font('hnm', 5)]: true,
  }),
}))`
  cursor: pointer;
  display: inline-flex;
  padding: 4px 10px;
  border: 1px solid ${props => props.theme.colors.green};
  background: ${props => (props.isActive ? props.theme.colors.green : '#fff')};
  color: ${props => (props.isActive ? '#fff' : '')};
  border-radius: 3px;
  transition: all 200ms ease;
  margin-right: 6px;
  margin-top: 6px;
  text-decoration: none;

  svg {
    transition: transform 200ms ease;
    fill: ${props => (props.isActive ? props.theme.colors.white : 'inherit')};
    transform: ${props => (props.isActive ? 'rotate(180deg)' : 'rotate(0)')};
  }

  &:hover {
    background: ${props => props.theme.colors.green};
    color: #fff;

    svg {
      fill: white;
    }
  }
`;

export default ProtoTag;
