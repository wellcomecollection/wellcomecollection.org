import { font, classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
import Space from '../styled/Space';
import AlignFont from '../styled/AlignFont';
import { InlineButton } from '../ButtonInline/ButtonInline';
import { FunctionComponent, ReactElement } from 'react';
import { LinkProps } from '../../../model/link-props';
export type TagType = {
  textParts: string[];
  linkAttributes: LinkProps;
};

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
                <InlineButton>
                  {textParts.map((part, i, arr) => (
                    <Space
                      as="span"
                      h={
                        i !== arr.length - 1
                          ? { size: 's', properties: ['margin-right'] }
                          : undefined
                      }
                      key={part}
                      className={classNames({
                        [font(
                          i === 0 && isFirstPartBold ? 'hnb' : 'hnr',
                          5
                        )]: true,
                        'inline-block': true,
                      })}
                    >
                      <AlignFont>
                        {part}
                        {i !== arr.length - 1 && (
                          <Space
                            as="span"
                            h={
                              // If we are the first element, we always have a `|` separator
                              i === 0 || separator !== ''
                                ? { size: 's', properties: ['padding-left'] }
                                : undefined
                            }
                            className={classNames({
                              [font('hnr', 5)]: true,
                              'inline-block': true,
                            })}
                          >
                            {' '}
                            {i === 0 ? '|' : separator}
                          </Space>
                        )}
                      </AlignFont>
                    </Space>
                  ))}
                </InlineButton>
              </NextLink>
            </Space>
          );
        })}
      </ul>
    </Space>
  );
};

export default Tags;
