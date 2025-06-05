import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

export type Props = {
  sourceLabel: string;
  description: string;
};

const SourcePill = styled(Space).attrs({
  className: font('intr', 6),
})`
    position: relative;
    display: inline;
    border-radius: 20px;
    background-color: #ccc;
    margin-left: 8px;
    cursor: pointer;
    padding: 2px 8px;
`;

const Paragraph = styled(Space)`
  display: inline;
`;

const SourceBox = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  position: absolute;
    background-color: white;
    top: 32px;
    left: 0;
    width: 224px;
    border-radius: 4px
`;

const ThemeSourceLabel: FunctionComponent<Props> = ({
  description,
  sourceLabel,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <Paragraph
        style={{
          textDecoration: isHovering ? 'underline dotted' : 'none',
        }}
      >
        {description}
      </Paragraph>
      <SourcePill
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {sourceLabel}
        <SourceBox
          style={{
            display: isHovering ? 'block' : 'none',
          }}
        >
          <div>Source:</div>
          <div>Wikidata</div>
        </SourceBox>
      </SourcePill>
    </>
  );
};

export default ThemeSourceLabel;
