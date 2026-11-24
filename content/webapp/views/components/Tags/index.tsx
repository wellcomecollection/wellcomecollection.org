import NextLink from 'next/link';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';

import { LinkProps } from '@weco/common/model/link-props';
import { typography } from '@weco/common/utils/classnames';
import { ENHANCED_CLASS } from '@weco/common/utils/enhanced';
import { ButtonColors } from '@weco/common/views/components/Buttons';
import {
  SolidButtonStyledProps,
  StyledButtonCSS,
} from '@weco/common/views/components/Buttons';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { SelectableTagLink } from '@weco/content/views/components/SelectableTags';

export type TagType = {
  textParts: string[];
  linkAttributes: LinkProps;
};

const TagInner = styled.span`
  white-space: normal;
  display: inline-block;
  text-align: left;
  line-height: 1.2;
`;

type PartWithSeparatorProps = {
  $separator: string;
  $isLast: boolean;
};

const NBSP = '\\00a0';

const PartWithSeparator = styled.span.attrs({
  className: typography('body', 'md', 'regular'),
})<PartWithSeparatorProps>`
  &::after {
    display: ${props => (props.$isLast ? 'none' : 'inline')};

    /* non-breaking space (\u00A0) keeps characters that would otherwise break (e.g. hyphens) stuck to the preceding text */
    content: '${NBSP}${props => props.$separator}${NBSP}';
  }
`;

const LinkWrapper = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-bottom'] },
  $h: { size: 'xs', properties: ['margin-right'] },
})`
  display: inline-block;
`;

const StyledLink = styled(NextLink)<SolidButtonStyledProps>`
  display: block;
  ${StyledButtonCSS}
`;

// Collapsing in CSS rather than from isEnhanced stops the list painting
// full-length and then shrinking once React loads.
const TagItem = styled(LinkWrapper)<{ $isBeyondLimit: boolean }>`
  ${props =>
    props.$isBeyondLimit &&
    css`
      .${ENHANCED_CLASS} & {
        display: none;
      }
    `}
`;

const ControlItem = styled(LinkWrapper)`
  display: none;

  .${ENHANCED_CLASS} & {
    display: inline-block;
  }
`;

const ShowAllButton = styled.button.attrs({
  type: 'button',
  className: typography('body', 'md', 'regular'),
})`
  display: inline-block;
  color: inherit;
  padding: 0;

  text-decoration: underline;
  text-underline-offset: 0.1em;

  &:hover {
    text-decoration-color: transparent;
  }
`;

export type Props = {
  tags: TagType[];
  buttonColors?: ButtonColors;
  isFirstPartBold?: boolean;
  separator?: string;
  /** Shows only this many tags, behind a control that reveals the rest. */
  maxVisible?: number;
  showAllText?: string;
  showFewerText?: string;
};

const Tags: FunctionComponent<Props> = ({
  tags,
  buttonColors,
  isFirstPartBold = true,
  separator = '–',
  maxVisible,
  showAllText = 'Show all',
  showFewerText = 'Show fewer',
}) => {
  const theme = useTheme();
  const [isShowingAll, setIsShowingAll] = useState(false);
  const firstRevealedTagRef = useRef<HTMLAnchorElement>(null);

  const limit =
    maxVisible !== undefined && tags.length > maxVisible
      ? maxVisible
      : undefined;
  const isCollapsed = limit !== undefined && !isShowingAll;

  // The control sits after the tags, so the ones it reveals land behind the
  // user's focus position. Leaving focus on the control means the next Tab
  // leaves the list, and reaching the 11th subject means tabbing back past
  // every one it just revealed.
  useEffect(() => {
    if (isShowingAll) firstRevealedTagRef.current?.focus();
  }, [isShowingAll]);

  return (
    <Space
      data-component="tags"
      $v={{ size: 'xs', negative: true, properties: ['margin-bottom'] }}
    >
      <PlainList>
        {/* Have to use index for key because some LCSH and MSH are the same and therefore textParts aren't unique */}
        {tags.map(({ textParts, linkAttributes }, i) => {
          const tagInner = (
            <TagInner>
              {textParts.map((part, i, arr) => (
                <PartWithSeparator
                  key={part}
                  $separator={i === 0 ? '|' : separator}
                  $isLast={i === arr.length - 1}
                >
                  <span
                    className={
                      i === 0 && isFirstPartBold
                        ? typography('body', 'md', 'strong')
                        : typography('body', 'md', 'regular')
                    }
                  >
                    {part}
                  </span>
                </PartWithSeparator>
              ))}
            </TagInner>
          );

          const tagRef = i === maxVisible ? firstRevealedTagRef : undefined;

          return (
            <TagItem as="li" key={i} $isBeyondLimit={isCollapsed && i >= limit}>
              {theme.brandUpdate ? (
                <SelectableTagLink
                  ref={tagRef}
                  href={linkAttributes.href}
                  $lineColor="black"
                  $lineThickness={1.4}
                  $isSelected={false}
                >
                  {tagInner}
                </SelectableTagLink>
              ) : (
                <StyledLink
                  ref={tagRef}
                  href={linkAttributes.href}
                  $size="small"
                  $colors={
                    buttonColors ?? theme.buttonColors.pumiceTransparentCharcoal
                  }
                >
                  {tagInner}
                </StyledLink>
              )}
            </TagItem>
          );
        })}

        {limit !== undefined && (
          <ControlItem as="li">
            <ShowAllButton
              aria-expanded={isShowingAll}
              data-gtm-trigger={isShowingAll ? 'show-fewer' : 'show-all'}
              onClick={() => setIsShowingAll(!isShowingAll)}
            >
              {isShowingAll ? (
                showFewerText
              ) : (
                <>
                  <span aria-hidden="true">{`+\u00A0`}</span>
                  {showAllText}
                </>
              )}
            </ShowAllButton>
          </ControlItem>
        )}
      </PlainList>
    </Space>
  );
};

export default Tags;
