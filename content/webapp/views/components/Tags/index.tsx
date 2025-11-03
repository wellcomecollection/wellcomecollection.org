import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled, { useTheme } from 'styled-components';

import { LinkProps } from '@weco/common/model/link-props';
import { font } from '@weco/common/utils/classnames';
import {
  SolidButtonStyledProps,
  StyledButtonCSS,
} from '@weco/common/views/components/Buttons';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

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

const nbsp = '\\00a0';

const PartWithSeparator = styled.span.attrs({
  className: font('intr', 5),
})<PartWithSeparatorProps>`
  &::after {
    display: ${props => (props.$isLast ? 'none' : 'inline')};

    /* non-breaking space (\u00A0) keeps characters that would otherwise break (e.g. hyphens) stuck to the preceding text */
    content: '${nbsp}${props => props.$separator}${nbsp}';
  }
`;

const LinkWrapper = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
  $h: { size: 's', properties: ['margin-right'] },
})`
  display: inline-block;
`;

const StyledLink = styled(NextLink)<SolidButtonStyledProps>`
  display: block;
  ${StyledButtonCSS}
`;

export type Props = {
  tags: TagType[];
  isFirstPartBold?: boolean;
  separator?: string;
};

const Tags: FunctionComponent<Props> = ({
  tags,
  isFirstPartBold = true,
  separator = '–',
}) => {
  const theme = useTheme();

  return (
    <Space
      data-component="tags"
      $v={{ size: 's', negative: true, properties: ['margin-bottom'] }}
    >
      <PlainList>
        {/* Have to use index for key because some LCSH and MSH are the same and therefore textParts aren't unique */}
        {tags.map(({ textParts, linkAttributes }, i) => {
          return (
            <LinkWrapper as="li" key={i}>
              <StyledLink
                href={linkAttributes.href}
                $size="small"
                $colors={theme.buttonColors.pumiceTransparentCharcoal}
              >
                <TagInner>
                  {textParts.map((part, i, arr) => (
                    <PartWithSeparator
                      key={part}
                      $separator={i === 0 ? '|' : separator}
                      $isLast={i === arr.length - 1}
                    >
                      <span
                        className={font(
                          i === 0 && isFirstPartBold ? 'intb' : 'intr',
                          5
                        )}
                      >
                        {part}
                      </span>
                    </PartWithSeparator>
                  ))}
                </TagInner>
              </StyledLink>
            </LinkWrapper>
          );
        })}
      </PlainList>
    </Space>
  );
};

export default Tags;
