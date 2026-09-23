import { setCookie } from 'cookies-next';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { filter } from '@weco/common/icons';
import { usePhasedFlags } from '@weco/common/server-data/Context';
import Icon from '@weco/common/views/components/Icon';
import { ResolvedPhasedFlag } from '@weco/toggles';

// Sketch/prototype - see the phase-switcher-widget branch. Lets anyone
// switch which phase they're seeing for a phased flag, without going
// through the toggles dashboard. Modelled on ApiToolbar and on Vercel's
// Toolbar Flags Explorer: sleeping/collapsed by default so it never adds
// noise to the tab order or screen-reader flow until deliberately opened.

const Wrapper = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 100;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: none;
  border-radius: 999px;
  background-color: ${props => props.theme.color('accent.purple')};
  color: ${props => props.theme.color('white')};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
    outline-offset: 4px;
  }
`;

const Panel = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  width: 320px;
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

const FlagBlock = styled.div`
  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid ${props => props.theme.color('neutral.300')};
  }
`;

const FlagLabel = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
`;

const Segmented = styled.fieldset`
  display: inline-flex;
  border: 1px solid ${props => props.theme.color('neutral.400')};
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0 0;
  padding: 0;
`;

const SegmentLabel = styled.label<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  background-color: ${props =>
    props.$checked ? props.theme.color('accent.green') : 'transparent'};
  color: ${props =>
    props.$checked
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

const PhaseSwitcher: FunctionComponent = () => {
  const phasedFlags = usePhasedFlags();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const entries = Object.entries(phasedFlags) as [string, ResolvedPhasedFlag][];

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  if (entries.length === 0) return null;

  return (
    <Wrapper
      data-component="phase-switcher"
      onKeyDown={e => {
        if (e.key === 'Escape' && isOpen) {
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <ToggleButton
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="phase-switcher-panel"
        onClick={() => setIsOpen(v => !v)}
      >
        <Icon icon={filter} iconColor="white" />
        Phases
      </ToggleButton>

      {isOpen && (
        <Panel
          id="phase-switcher-panel"
          ref={panelRef}
          tabIndex={-1}
          role="region"
          aria-label="Switch which phase you're seeing"
        >
          {entries.map(([id, resolved]) => (
            <FlagBlock key={id}>
              <FlagLabel>{resolved.title}</FlagLabel>
              <Segmented aria-label={`Phase for ${resolved.title}`}>
                {resolved.phases.map(phase => (
                  <SegmentLabel
                    key={phase.id}
                    $checked={resolved.current === phase.id}
                  >
                    <input
                      type="radio"
                      name={`phase-switcher-${id}`}
                      checked={resolved.current === phase.id}
                      onChange={() => {
                        setCookie(`toggle_${id}`, phase.id, {
                          domain: 'wellcomecollection.org',
                          path: '/',
                          secure: true,
                        });
                        window.location.reload();
                      }}
                    />
                    {phase.label}
                  </SegmentLabel>
                ))}
              </Segmented>
            </FlagBlock>
          ))}
        </Panel>
      )}
    </Wrapper>
  );
};

export default PhaseSwitcher;
