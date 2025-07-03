import Image from 'next/image';
import {
  FunctionComponent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import MeshLogo from '@weco/content/components/ThemeSourcedDescription/mesh-logo.png';
import { WikidataLogo } from '@weco/content/components/ThemeSourcedDescription/ThemeSourcedDescription.Icons';
import { SourceOntology } from '@weco/content/services/wellcome/catalogue/types';

const getReadableSource = (source: SourceOntology) => {
  if (source === 'nlm-mesh') return 'MeSH';
  if (source === 'wikidata') return 'Wikidata';

  return 'Library of Congress';
};

const SOURCE_BOX_WIDTH = 224;

const SourceBoxContainer = styled.div<{ $marginLeft: number }>`
  position: absolute;
  top: 21px;
  padding-top: ${props => props.theme.spacingUnits['3']}px;
  left: 0;
  margin-left: ${props => props.$marginLeft}px;
  width: ${SOURCE_BOX_WIDTH}px;
  opacity: 0;
  transition:
    visibility 200ms ease,
    opacity 200ms ease;
  visibility: hidden;
  z-index: 3;
`;

const showSourceBox = css`
  opacity: 1;
  visibility: visible;
`;

const SourcePill = styled.div.attrs({
  className: font('intr', 6),
})`
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  background-color: ${props => props.theme.color('accent.green')}40;
  cursor: default;
  height: 22px;
  vertical-align: middle;

  @media (hover: hover) {
    &:hover ${SourceBoxContainer} {
      ${showSourceBox}
    }
  }

  &:focus-within ${SourceBoxContainer} {
    ${showSourceBox}
  }
`;

const underlineParagraph = css`
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: ${props => props.theme.color('neutral.600')};
  text-underline-offset: ${props => props.theme.spacingUnits['3']}px;
`;

const Paragraph = styled.p.attrs({
  className: font('intr', 3),
})`
  display: inline;
  padding-right: ${props => props.theme.spacingUnits['3']}px;

  @media (hover: hover) {
    &:has(+ ${SourcePill}:hover) {
      ${underlineParagraph}
    }
  }

  &:has(+ ${SourcePill}:focus-within) {
    ${underlineParagraph}
  }
`;

const SourceBox = styled(Space).attrs({
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: white;
  border-radius: 4px;
`;

const SourceLink = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-top'] },
})`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: ${props => props.theme.spacingUnits['3']}px;

  img {
    height: 16px;
    width: 16px;
  }
`;

const SourceLabel = styled.span`
  padding: 0 ${props => props.theme.spacingUnits['3']}px;
`;

export type Props = {
  source: SourceOntology;
  description: string;
  href: string;
};

const ThemeSourcedDescription: FunctionComponent<Props> = ({
  description,
  source,
  href,
}) => {
  const sourcePillRef = useRef<HTMLDivElement>(null);
  const sourcePillContainerRef = useRef<HTMLDivElement>(null);
  const [sourceBoxMarginLeft, setSourceBoxMarginLeft] = useState(0);

  const updateSourceBoxPosition = () => {
    if (!sourcePillRef.current) return;

    const leftPillPosition = sourcePillRef.current.getBoundingClientRect().left;
    const maxAllowedLeftPosition = window.innerWidth - (SOURCE_BOX_WIDTH + 32);
    setSourceBoxMarginLeft(
      Math.min(0, maxAllowedLeftPosition - leftPillPosition)
    );
  };

  const isSourcePilFocused = () => {
    const active = document.activeElement;

    return (
      active === sourcePillContainerRef.current ||
      sourcePillContainerRef.current?.contains(active)
    );
  };

  const blurActiveElement = () => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;

    active.blur();
  };

  const toggleSourceBoxFocus = (event: TouchEvent<HTMLDivElement>) => {
    event.preventDefault();

    isSourcePilFocused()
      ? blurActiveElement()
      : sourcePillContainerRef.current?.focus();
  };

  useEffect(() => {
    const hideSourceBox = () => {
      if (isSourcePilFocused()) blurActiveElement();
      updateSourceBoxPosition();
    };

    // Hide source box on screen resize to stop it from overflowing the screen
    window.addEventListener('resize', hideSourceBox);
    return () => window.removeEventListener('resize', hideSourceBox);
  }, [sourcePillRef]);

  useEffect(() => {
    // Prevent horizontal scroll on initial render
    updateSourceBoxPosition();
  }, []);

  return (
    <>
      <Paragraph>{description}</Paragraph>
      <SourcePill
        tabIndex={0}
        onMouseEnter={updateSourceBoxPosition}
        onFocus={updateSourceBoxPosition}
        ref={sourcePillContainerRef}
      >
        <SourceLabel
          ref={sourcePillRef}
          // On touch screens, clicking on the pill while the source box is visible should hide it
          onTouchEnd={toggleSourceBoxFocus}
        >
          {getReadableSource(source)}
        </SourceLabel>
        <SourceBoxContainer $marginLeft={sourceBoxMarginLeft}>
          <SourceBox>
            <span className={font('intm', 6)}>Source:</span>
            <SourceLink>
              {source === 'wikidata' && <WikidataLogo width={16} />}
              {source === 'nlm-mesh' && (
                <Image src={MeshLogo} alt="MeSH logo" />
              )}
              <a href={href} target="_blank" rel="noopener noreferrer">
                {getReadableSource(source)}
              </a>
            </SourceLink>
          </SourceBox>
        </SourceBoxContainer>
      </SourcePill>
    </>
  );
};

export default ThemeSourcedDescription;
