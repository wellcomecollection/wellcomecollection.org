import { font, classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
import Space from '../styled/Space';
import { InlineButton } from '@weco/common/views/components/ButtonInline/ButtonInline';

export type TagType = {
  textParts: string[];
  linkAttributes: {href: {pathname: string, query: string}, as: {pathname: string, query: string}};
};

type Props = {
  tags: TagType[],
};

const Tags = ({ tags }: Props) => {
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
                        [font(i === 0 ? 'hnm' : 'hnl', 5)]: true,
                        'inline-block': true,
                      })}
                    >
                      {part}
                      {i !== arr.length - 1 && (
                        <Space
                          as="span"
                          h={{ size: 's', properties: ['padding-left'] }}
                          className={classNames({
                            [font('hnl', 5)]: true,
                            'inline-block': true,
                          })}
                        >
                          {' '}
                          {i === 0 ? '|' : '–'}
                        </Space>
                      )}
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
