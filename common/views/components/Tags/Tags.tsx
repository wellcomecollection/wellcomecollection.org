import { font, classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
import Space from '../styled/Space';
import { SolidButton } from '../ButtonSolid/ButtonSolid';
import { FunctionComponent, ReactElement } from 'react';
import { LinkProps } from '../../../model/link-props';
import styled from 'styled-components';
import { themeValues } from '@weco/common/views/themes/config';

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
  separator: string;
  isLast: boolean;
};

const PartWithSeparator = styled.span.attrs({
  className: classNames({
    [font('intr', 5)]: true,
  }),
})<PartWithSeparatorProps>`
  &:after {
    display: ${props => (props.isLast ? 'none' : 'inline')};
    content: '\u00A0${props =>
      props.separator}\u00A0'; // non-breaking space (\u00A0) keeps characters that would otherwise break (e.g. hyphens) stuck to the preceding text
  }
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
}: Props): ReactElement<Props> => {
  return (
    <Space v={{ size: 's', negative: true, properties: ['margin-bottom'] }}>
      <ul
        className={classNames({
          'plain-list no-margin no-padding': true,
        })}
      >
        {/* Have to use index for key because some LCSH and MSH are the same and therefore textParts aren't unique */}
        {tags.map(({ textParts, linkAttributes }, i) => {
          return (
            <Space
              as="li"
              key={i}
              v={{
                size: 's',
                properties: ['margin-bottom'],
              }}
              h={{ size: 's', properties: ['margin-right'] }}
              className={classNames({
                'inline-block': true,
              })}
            >
              <NextLink {...linkAttributes} passHref>
                <SolidButton
                  size="small"
                  colors={themeValues.buttonColors.pumiceTransparentCharcoal}
                >
                  <TagInner>
                    {textParts.map((part, i, arr) => (
                      <PartWithSeparator
                        key={part}
                        separator={i === 0 ? '|' : separator}
                        isLast={i === arr.length - 1}
                      >
                        <span
                          className={classNames({
                            [font(
                              i === 0 && isFirstPartBold ? 'intb' : 'intr',
                              5
                            )]: true,
                          })}
                        >
                          {part}
                        </span>
                      </PartWithSeparator>
                    ))}
                  </TagInner>
                </SolidButton>
              </NextLink>
            </Space>
          );
        })}
      </ul>
    </Space>
  );
};

export default Tags;
