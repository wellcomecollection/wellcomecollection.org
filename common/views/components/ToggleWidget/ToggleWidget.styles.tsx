import styled, { css } from 'styled-components';

export const ToggleWidgetWrapper = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: ${props => props.theme.zIndex.toggleWidget};
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

// Shared by the header's and each toggle title's dash link, so they read
// as part of the text rather than default link blue.
const dashLinkStyles = css`
  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  a:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
    outline-offset: 2px;
  }
`;

export const PanelHeader = styled.p`
  margin: 0 0 12px;
  padding-bottom: 12px;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};

  ${dashLinkStyles}
`;

export const ToggleBlock = styled.div`
  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid ${props => props.theme.color('neutral.300')};
  }
`;

export const ToggleHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

export const ResetButton = styled.button`
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: none;
  color: ${props => props.theme.color('neutral.700')};
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
    outline-offset: 2px;
  }
`;

export const ToggleLabel = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 14px;

  ${dashLinkStyles}
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
        ? props.theme.color({ brand: 'teal.10', legacy: 'accent.lightGreen' })
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

const RUNG_PADDING = '4px';
const RUNG_LINE_HEIGHT = '20px';
const MARKER_SIZE = '14px';

export const Ladder = styled.fieldset`
  margin: 8px 0 0;
  padding: 0;
  border: 0;
  min-width: 0;
`;

export const LadderRung = styled.label<{
  $state: SegmentState;
  $line?: 'active' | 'inactive';
}>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${RUNG_PADDING} 6px;
  border-radius: 8px;
  font-size: 13px;
  line-height: ${RUNG_LINE_HEIGHT};
  font-weight: ${props => (props.$state === 'current' ? 600 : 400)};
  color: ${props => props.theme.color('neutral.700')};
  background-color: ${props =>
    props.$state === 'current'
      ? props.theme.color({ brand: 'teal.10', legacy: 'accent.lightGreen' })
      : 'transparent'};
  cursor: pointer;

  /* Joins this step's marker to the next one's, reaching into the next row */
  ${props =>
    props.$line &&
    css`
      &::after {
        content: '';
        position: absolute;
        z-index: 1;
        left: calc(6px + ${MARKER_SIZE} / 2 - 1px);
        top: calc(${RUNG_PADDING} + (${RUNG_LINE_HEIGHT} + ${MARKER_SIZE}) / 2);
        bottom: calc(
          -1 * (${RUNG_PADDING} + (${RUNG_LINE_HEIGHT} - ${MARKER_SIZE}) / 2)
        );
        width: 2px;
        background-color: ${
          props.$line === 'active'
            ? props.theme.color('accent.green')
            : props.theme.color('neutral.400')
        };
      }
    `}

  &:hover {
    ${props =>
      props.$state !== 'current' &&
      css`
        background-color: ${props.theme.color('neutral.200')};
      `}
  }

  &:has(input:focus-visible) {
    outline: 3px solid ${props => props.theme.color('accent.purple')};
    outline-offset: -3px;
  }

  input {
    /* Visually hidden but still focusable/operable - the row carries the look */
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }
`;

export const LadderMarker = styled.span<{ $state: SegmentState }>`
  position: relative;
  z-index: 2;
  flex: none;
  box-sizing: border-box;
  width: ${MARKER_SIZE};
  height: ${MARKER_SIZE};
  border-radius: 50%;
  border: 2px solid
    ${props =>
      props.$state === 'inactive'
        ? props.theme.color('neutral.400')
        : props.theme.color('accent.green')};
  background-color: ${props => {
    if (props.$state === 'current') return props.theme.color('accent.green');
    return props.$state === 'included'
      ? props.theme.color({ brand: 'teal.10', legacy: 'accent.lightGreen' })
      : props.theme.color('white');
  }};
`;

export const PublicTag = styled.span`
  padding: 0 6px;
  border: 1px solid ${props => props.theme.color('accent.green')};
  border-radius: 999px;
  color: ${props => props.theme.color('neutral.700')};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 16px;
  text-transform: uppercase;
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
