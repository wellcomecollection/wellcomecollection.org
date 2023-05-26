import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';

export const Container = styled.nav.attrs({
  className: `${font('intr', 6)} is-hidden-print`,
})<{
  isHiddenMobile?: boolean;
}>`
  display: flex;
  align-items: center;

  /* We're removing the top pagination on mobile to avoid the controls getting too crowded. */
  ${props =>
    props.theme.media(
      'medium',
      'max-width'
    )(`
      ${props.isHiddenMobile && 'display: none;'}; 
    `)}
`;

export const ChevronWrapper = styled.button<{
  prev?: boolean;
  hasDarkBg?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 34px;
  border-radius: 100%;
  margin: 0 0 0 1rem;
  cursor: pointer;
  transition: background ${props => props.theme.transitionProperties};

  /* This is required to make the icon be the right size on iOS.  If this class
    has 'position: relative', then iOS will give it an incorrect height and
    it will appear super small.  Illegible! */
  .icon {
    position: absolute;
  }

  &[disabled] {
    pointer-events: none;
    color: ${props =>
      props.theme.color(props.hasDarkBg ? 'neutral.300' : 'neutral.500')};
    border-color: ${props =>
      props.theme.color(props.hasDarkBg ? 'neutral.300' : 'neutral.500')};
  }

  ${props => props.prev && `margin: 0 1rem 0 0;`}

  ${props => `
      color: ${props.theme.color(props.hasDarkBg ? 'white' : 'black')};
      border: 1px solid ${props.theme.color(
        props.hasDarkBg ? 'neutral.400' : 'neutral.600'
      )};
      transform: rotate(${props.prev ? '90' : '270'}deg);
  
      &:hover, &:focus {
        background-color: ${props.theme.color(
          props.hasDarkBg ? 'neutral.600' : 'neutral.300'
        )};
      }
    `}
`;

export const PageSelectorInput = styled.input<{ darkBg?: boolean }>`
  height: 36px;
  width: 36px;
  max-width: 50px;
  background: none;
  color: ${({ darkBg, theme }) => theme.color(darkBg ? 'white' : 'black')};
  border: ${({ darkBg, theme }) =>
      theme.color(darkBg ? 'neutral.300' : 'neutral.600')}
    1px solid;
  text-align: center;
  margin: 0 10px;
`;
