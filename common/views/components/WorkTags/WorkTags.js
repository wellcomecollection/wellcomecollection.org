import styled from 'styled-components';
import { spacing, font, classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
import type { NextLinkType } from '@weco/common/model/next-link-type';

export type WorkTagType = {|
  query: string,
  textParts: string[],
  linkAttributes: NextLinkType,
|};

const WorkTag = styled.div`
  border-radius: 3px;
  text-decoration: none;
  padding: 0.05em 0.5em;
  transition: color 250ms ease, background 250ms ease;
`;

type Props = {
  tags: WorkTagType[],
};

const WorkTags = ({ tags }: Props) => {
  return (
    <ul
      className={classNames({
        'plain-list': true,
        [spacing({ s: 0 }, { padding: ['left'] })]: true,
      })}
    >
      {tags.map(({ query, textParts, linkAttributes }) => {
        return (
          <li
            key={query}
            className={classNames({
              'inline-block': true,
            })}
          >
            <NextLink {...linkAttributes}>
              <a>
                <WorkTag
                  className={classNames({
                    [spacing({ s: 1 }, { margin: ['right'] })]: true,
                    [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
                    'inline-block bg-hover-green font-hover-white': true,
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
                      {part}
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
                </WorkTag>
              </a>
            </NextLink>
          </li>
        );
      })}
    </ul>
  );
};

export default WorkTags;
