import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import WikidataLogo from '@weco/content/components/ThemeSourcedDescription/WikidataLogo';

export type Props = {
  source: 'Wikidata' | 'MeSH';
  description: string;
  href: string;
};

const SourcePill = styled(Space).attrs({
  className: `${font('intr', 6)} source-pill`,
})`
  position: relative;
  display: inline;
  border-radius: 20px;
  background-color: ${props => props.theme.color('accent.lightGreen')};
  margin-left: 8px;
  cursor: default;
  padding: 2px 8px;
  height: 22px;

  &:is(:hover, :focus-within) .source-box-container {
    display: block;
    opacity: 1;
    visibility: visible;
  }
`;

const Paragraph = styled(Space).attrs({
  as: 'p',
})`
  display: inline;

  &:has(+ .source-pill:focus-within, + .source-pill:hover) {
    text-decoration: underline dotted;
  }
`;

const SourceBoxContainer = styled(Space).attrs({
  className: 'source-box-container',
})`
  position: absolute;
  top: 21px;
  padding-top: 10px;
  left: 0;
  width: 224px;
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
  gap: 8px;
`;

const ThemeSourcedDescription: FunctionComponent<Props> = ({
  description,
  source,
  href,
}) => {
  return (
    <>
      <Paragraph>{description}</Paragraph>
      <SourcePill tabindex="0">
        {source}
        <SourceBoxContainer>
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
