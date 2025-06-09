import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import WikidataLogo from '@weco/content/components/ThemeSourcedDescription/WikidataLogo';

const SOURCE_BOX_WIDTH = 224;

const SourcePill = styled(Space).attrs({
  className: `${font('intr', 6)} source-pill`,
})`
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  background-color: ${props => props.theme.color('accent.green')}40;
  cursor: default;
  padding: 0 ${props => props.theme.spacingUnits['3']}px;
  height: 22px;
  vertical-align: middle;

  &:is(:hover, :focus-within) .source-box-container {
    display: block;
    opacity: 1;
    visibility: visible;
  }
`;

const Paragraph = styled(Space).attrs({
  as: 'p',
  className: font('intr', 3),
})`
  display: inline;
  padding-right: ${props => props.theme.spacingUnits['3']}px;

  &:has(+ .source-pill:focus-within, + .source-pill:hover) {
    text-decoration: underline dotted;
  }
`;

const SourceBoxContainer = styled(Space).attrs({
  className: 'source-box-container',
})<{ $marginLeft: number }>`
  position: absolute;
  top: 21px;
  padding-top: 10px;
  left: 0;
  margin-left: ${props => props.$marginLeft}px;
  width: ${SOURCE_BOX_WIDTH}px;
  opacity: 0;
  transition:
    visibility 200ms ease,
    opacity 200ms ease;
  visibility: hidden;
`;

const SourceBox = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  className: 'source-box',
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
    updateSourceBoxPosition();
    window.addEventListener('resize', updateSourceBoxPosition);
    return () => window.removeEventListener('resize', updateSourceBoxPosition);
  }, [sourcePillRef]);

  return (
    <>
      <Paragraph>{description}</Paragraph>
      <SourcePill tabindex="0" ref={sourcePillRef}>
        {source}
        <SourceBoxContainer $marginLeft={sourceBoxMarginLeft}>
          <SourceBox>
            <span className={font('intm', 6)}>Source:</span>
            <SourceLink>
              {source === 'Wikidata' && <WikidataLogo width={16} />}
              {source === 'MeSH' && <WikidataLogo width={16} />}
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
