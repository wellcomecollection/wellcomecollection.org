import styled from 'styled-components';
import { font, classNames } from '../../../utils/classnames';

const ProtoTag = styled.div.attrs(props => ({
  className: classNames({
    [font(props.isPrimary ? 'hnm' : 'hnl', props.small ? 6 : 5)]: true,
  }),
}))`
  cursor: pointer;
  display: inline-flex;
  padding: ${props => (props.small ? '2px 7px' : '4px 10px')};
  border: 1px solid
    ${props => (props.isPrimary ? 'transparent' : props.theme.colors.charcoal)};
  background: ${props =>
    props.isPrimary
      ? 'white'
      : props.isActive
      ? props.theme.colors.charcoal
      : 'transparent'};
  border-radius: 3px;
  transition: all 200ms ease;
  margin-right: 6px;
  margin-top: 6px;
  text-decoration: none;
  color: ${props => props.isActive && !props.isPrimary && 'white'};

  svg {
    transition: transform 200ms ease;
    transform: ${props => (props.isActive ? 'rotate(180deg)' : 'rotate(0)')};
  }

  &:hover {
    color: ${props => !props.isPrimary && 'white'};
    background: ${props => !props.isPrimary && props.theme.colors.charcoal};
  }
`;

export default ProtoTag;
