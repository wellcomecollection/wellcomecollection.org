// @flow

import styled from 'styled-components';
import NextLink from 'next/link';
import type { NextLinkType } from '@weco/common/model/next-link-type';
import { spacing, font, classNames } from '../../../utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';

export type TagType = {|
  textParts: string[],
  linkAttributes: NextLinkType,
  selected: boolean,
|};

const Tag = styled.div`
  border-radius: 3px;
  text-decoration: none;
  padding: ${props =>
    props.selected ? '0.2em 0.5em' : '0.2em calc(0.5em + 12px)'};
  transition: color 250ms ease, background 250ms ease;
`;

type Props = {
  tags: TagType[],
};

const SelectableTags = ({ tags }: Props) => {
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
        {tags.map(({ textParts, linkAttributes, selected }) => {
          return (
            <li
              key={textParts.join('-')}
              className={classNames({
                'inline-block': true,
              })}
            >
              <NextLink {...linkAttributes}>
                <a>
                  <Tag
                    selected={selected}
                    className={classNames({
                      [spacing({ s: 1 }, { margin: ['right'] })]: true,
                      [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
                      'line-height-1': true,
                      'inline-block': true,
                      'bg-hover-green font-hover-white': !selected,
                      'bg-green font-white': selected,
                      'border-color-green border-width-1': true,
                    })}
                  >
                    {textParts.map((part, i, arr) => (
                      <span
                        key={part}
                        className={classNames({
                          [font({ s: 'HNM5', m: 'HNM4' })]: i === 0,
                          [font({ s: 'HNL5', m: 'HNL4' })]: i !== 0,
                          [spacing({ s: 1 }, { margin: ['right'] })]:
                            i !== arr.length - 1,
                          'inline-block': true,
                        })}
                      >
                        {selected && (
                          <span
                            className={classNames({
                              flex: true,
                              'flex--v-center': true,
                            })}
                          >
                            {part}
                            <Icon
                              name="cross"
                              extraClasses={classNames({
                                'icon--18': true,
                                [spacing({ s: 1 }, { margin: ['left'] })]: true,
                              })}
                            />
                          </span>
                        )}
                        {!selected && part}
                        {i !== arr.length - 1 && (
                          <span
                            className={classNames({
                              [font({ s: 'HNL4' })]: true,
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

export default SelectableTags;
