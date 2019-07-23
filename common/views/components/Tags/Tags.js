import styled from 'styled-components';
import { spacing, font, classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
import type { NextLinkType } from '@weco/common/model/next-link-type';

export type TagType = {|
  textParts: string[],
  linkAttributes: NextLinkType,
|};

const Tag = styled.div`
  border-radius: 3px;
  text-decoration: none;
  padding: 0.2em 0.5em;
  transition: color 250ms ease, background 250ms ease;
`;

type Props = {
  tags: TagType[],
};

const Tags = ({ tags }: Props) => {
  return (
    <div
      className={classNames({
        // Cancel out space below individual tags
        [spacing({ s: -2 }, { margin: ['bottom'] })]: true,
      })}
    >
      <ul
        className={classNames({
          'plain-list': true,
          [spacing({ s: 0 }, { padding: ['left'], margin: ['top'] })]: true,
        })}
      >
        {/* Have to use index for key because some LCSH and MSH are the same and therefore textParts aren't unique */}
        {tags.map(({ textParts, linkAttributes }, i) => {
          return (
            <li
              key={i}
              className={classNames({
                'inline-block': true,
              })}
            >
              <NextLink {...linkAttributes}>
                <a>
                  <Tag
                    className={classNames({
                      [spacing({ s: 1 }, { margin: ['right'] })]: true,
                      [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
                      'line-height-1': true,
                      'inline-block bg-hover-green font-hover-white': true,
                      'border-color-green border-width-1': true,
                    })}
                  >
                    {/* An empty span for the light and medium font weights, so that
                    the tag will always be the height of the larger of the two. */}
                    <span
                      className={classNames({
                        [font('hnl', 4)]: true,
                      })}
                    />
                    <span
                      className={classNames({
                        [font('hnm', 4)]: true,
                      })}
                    />

                    {textParts.map((part, i, arr) => (
                      <span
                        key={part}
                        className={classNames({
                          [font('hnm', 4)]: i === 0,
                          [font('hnl', 4)]: i !== 0,
                          [spacing({ s: 1 }, { margin: ['right'] })]:
                            i !== arr.length - 1,
                          'inline-block': true,
                        })}
                      >
                        {part}
                        {i !== arr.length - 1 && (
                          <span
                            className={classNames({
                              [font('hnl', 4)]: true,
                            })}
                          >
                            {' '}
                            {i === 0 ? '|' : '–'}
                          </span>
                        )}
                      </span>
                    ))}
                  </Tag>
                </a>
              </NextLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tags;
