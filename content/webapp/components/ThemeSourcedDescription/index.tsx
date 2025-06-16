import Image from 'next/image';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import MeshLogo from '@weco/content/components/ThemeSourcedDescription/mesh-logo.png';
import { WikidataLogo } from '@weco/content/components/ThemeSourcedDescription/ThemeSourcedDescription.Icons';

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

  &:is(:hover, :focus-within) ${SourceBoxContainer} {
    opacity: 1;
    visibility: visible;
  }
`;

const Paragraph = styled.p.attrs({
  className: font('intr', 3),
})`
  display: inline;
  padding-right: ${props => props.theme.spacingUnits['3']}px;

  &:has(+ ${SourcePill}:focus-within, + ${SourcePill}:hover) {
    text-decoration: underline;
    text-decoration-style: dotted;
    text-decoration-color: ${props => props.theme.color('neutral.600')};
    text-underline-offset: ${props => props.theme.spacingUnits['3']}px;
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
  source: 'Wikidata' | 'MeSH';
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

  useEffect(() => {
    const hideSourceBox = () => {
      const active = document.activeElement;
      if (
        !active ||
        !(active instanceof HTMLElement) ||
        !sourcePillContainerRef.current
      )
        return;

      if (
        active === sourcePillContainerRef.current ||
        sourcePillContainerRef.current.contains(active)
      ) {
        active.blur();
      }
    };

    // Hide source box on screen resize to stop it from overflowing the screen
    window.addEventListener('resize', hideSourceBox);
    return () => window.removeEventListener('resize', hideSourceBox);
  }, [sourcePillRef]);

  return (
    <>
      <Paragraph>{description}</Paragraph>
      <SourcePill
        tabIndex={0}
        onMouseEnter={updateSourceBoxPosition}
        onFocus={updateSourceBoxPosition}
        ref={sourcePillContainerRef}
      >
        <SourceLabel ref={sourcePillRef}>{source}</SourceLabel>
        <SourceBoxContainer $marginLeft={sourceBoxMarginLeft}>
          <SourceBox>
            <span className={font('intm', 6)}>Source:</span>
            <SourceLink>
              {source === 'Wikidata' && <WikidataLogo width={16} />}
              {source === 'MeSH' && <Image src={MeshLogo} alt="MeSH logo" />}
              <a href={href} target="_blank" rel="noopener noreferrer">
                {source}
              </a>
            </SourceLink>
          </SourceBox>
        </SourceBoxContainer>
      </SourcePill>
    </>
  );
};

export default ThemeSourcedDescription;
