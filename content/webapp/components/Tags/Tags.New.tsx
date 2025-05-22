import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { LinkProps } from '@weco/common/model/link-props';
import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

export type TagType = {
  textParts: string[];
  linkAttributes: LinkProps;
};

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

const LinkWrapper = styled(Space).attrs<{ $isLast: boolean }>(props => ({
  $v: { size: 's', properties: ['margin-bottom'] },
  ...(!props.$isLast && { $h: { size: 'l', properties: ['margin-right'] } }),
}))`
  display: inline-block;
`;

const FancyLink = styled.a`
  display: inline-block;
  text-decoration: none;
  position: relative;
  z-index: 1;
  transition: color 400ms ease;
  padding-top: 1rem;
  padding-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0.9rem;
    height: 2px;
    right: 0;
    width: 100%;
    background: ${props => props.theme.color('black')};
    z-index: -1;
    transition: width 200ms ease;
  }

  &:hover {
    &::after {
      width: 0;

      /* Prevent iOS double-tap link issue
      https://css-tricks.com/annoying-mobile-double-tap-link-issue/ */
      @media (pointer: coarse) {
        width: 0;
      }
    }
  }
`;

export type Props = {
  tags: TagType[];
  isFirstPartBold?: boolean;
  separator?: string;
};

const TagsNew: FunctionComponent<Props> = ({
  tags,
  isFirstPartBold = true,
  separator = '–',
}) => {
  return (
    <Space $v={{ size: 's', negative: true, properties: ['margin-bottom'] }}>
      <PlainList>
        {/* Have to use index for key because some LCSH and MSH are the same and therefore textParts aren't unique */}
        {tags.map(({ textParts, linkAttributes }, i) => {
          return (
            <LinkWrapper as="li" key={i} $isLast={i === tags.length - 1}>
              <NextLink {...linkAttributes} passHref legacyBehavior>
                <FancyLink>
                  {textParts.map((part, i, arr) => (
                    <PartWithSeparator
                      key={part}
                      $separator={i === 0 ? '|' : separator}
                      $isLast={i === arr.length - 1}
                    >
                      <span
                        className={
                          i === 0 && isFirstPartBold
                            ? font('intb', 5)
                            : font('intr', 5)
                        }
                      >
                        {part}
                      </span>
                    </PartWithSeparator>
                  ))}
                </FancyLink>
              </NextLink>
            </LinkWrapper>
          );
        })}
      </PlainList>
    </Space>
  );
};

export default TagsNew;
