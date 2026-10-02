import styled from 'styled-components';

export const ToggleWidgetWrapper = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 9999999;
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: none;
  border-radius: 999px;
  background-color: ${props => props.theme.color('accent.purple')};
  color: ${props => props.theme.color('white')};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
    outline-offset: 4px;
  }
`;

export const DismissButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${props => props.theme.color('accent.purple')};
  color: ${props => props.theme.color('white')};
  cursor: pointer;

  &:hover .icon {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
    outline-offset: 2px;
  }
`;

export const Panel = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  box-sizing: border-box;
  width: min(320px, calc(100vw - 32px));
  max-height: 60vh;
  overflow-y: auto;
  background-color: ${props => props.theme.color('white')};
  color: ${props => props.theme.color('neutral.700')};
  border: 1px solid ${props => props.theme.color('neutral.400')};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  padding: 16px;

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
  }
`;

export const PanelHeader = styled.p`
  margin: 0 0 12px;
  padding-bottom: 12px;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};
`;

export const ToggleBlock = styled.div`
  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid ${props => props.theme.color('neutral.300')};
  }
`;

export const ToggleLabel = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
`;

export const ToggleNote = styled.span`
  margin-left: 6px;
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.theme.color('neutral.600')};
`;

export const Segmented = styled.fieldset`
  display: inline-flex;
  border: 1px solid ${props => props.theme.color('neutral.400')};
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0 0;
  padding: 0;

  &:disabled {
    opacity: 0.5;
  }
`;

export type SegmentState = 'current' | 'included' | 'inactive';

export const SegmentLabel = styled.label<{ $state: SegmentState }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  background-color: ${props =>
    props.$state === 'current'
      ? props.theme.color('accent.green')
      : props.$state === 'included'
        ? props.theme.color('accent.lightGreen')
        : 'transparent'};
  color: ${props =>
    props.$state === 'current'
      ? props.theme.color('white')
      : props.theme.color('neutral.700')};

  & + & {
    border-left: 1px solid ${props => props.theme.color('neutral.400')};
  }

  /* Segmented's overflow: hidden clips anything outside the pill shape, so
     the focus ring has to sit inside the label's own box (negative offset)
     rather than around it. */
  &:has(input:focus-visible) {
    position: relative;
    z-index: 1;
    outline: 3px solid ${props => props.theme.color('accent.purple')};
    outline-offset: -3px;
  }

  input {
    /* Visually hidden but still focusable/operable - the label carries the look */
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }
`;

export const SelectToggleOption = styled.select`
  display: block;
  margin-top: 8px;
  max-width: 100%;
  padding: 4px 8px;
  font-size: 13px;
  border: 1px solid ${props => props.theme.color('neutral.400')};
  border-radius: 4px;

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
    outline-offset: 2px;
  }
`;
