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
  ...(!props.$isLast && { $h: { size: 'l', properties: ['margin-right'] } }),
}))<{ $isLast: boolean }>`
  display: inline-block;
  margin-bottom: ${props => (props.$isLast ? '6px' : '10px')};
`;

const FancyLink = styled.a`
  --line: ${props => props.theme.color('black')};
  text-decoration: none;
  position: relative;

  & > span {
    background-image: linear-gradient(0deg, var(--line) 0%, var(--line) 100%);
    background-position: 100% 100%;
    background-repeat: no-repeat;
    background-size: var(--background-size, 100%) 2px;
    transition: background-size 0.2s linear 300ms;
    font-size: 16px;
    line-height: 20px;
    transform: translateZ(0);
    padding-bottom: 2px;
  }

  &:hover {
    --background-size: 0%;
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
