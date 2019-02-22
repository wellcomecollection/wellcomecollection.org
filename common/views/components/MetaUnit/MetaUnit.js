// @flow
import type { Node } from 'react';
import { spacing, font, classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
import type { NextLinkType } from '@weco/common/model/next-link-type';
import styled from 'styled-components';

const WorkTag = styled.div`
  border-radius: 3px;
  text-decoration: none;
  padding: 0.05em 0.5em;
  transition: color 250ms ease, background 250ms ease;
`;

const workTagClasses = classNames({
  [spacing({ s: 1 }, { margin: ['right'] })]: true,
  [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
  'inline-block bg-hover-green font-hover-white': true,
  'border-color-green border-width-1': true,
});

type WorkTagType = {|
  query: string,
  textParts: string[],
  linkAttributes: NextLinkType,
|};

type HeadingProps = {
  headingLevel: ?number,
  headingText: string,
};
const Heading = ({ headingLevel, headingText }: HeadingProps) => {
  const classes = `${font({ s: 'HNM4', m: 'HNM3' })} ${spacing(
    { s: 0 },
    { margin: ['top'] }
  )} ${spacing({ s: 0 }, { margin: ['bottom'] })}`;
  const smallClasses = `${font({ s: 'HNM6', m: 'HNM5' })} ${spacing(
    { s: 0 },
    { margin: ['top'] }
  )} ${spacing({ s: 1 }, { margin: ['bottom'] })}`;
  switch (headingLevel) {
    case 1:
      return <h1 className={classes}>{headingText}</h1>;
    case 2:
      return <h2 className={classes}>{headingText}</h2>;
    case 3:
      return <h3 className={classes}>{headingText}</h3>;
    case 4:
      return <h4 className={smallClasses}>{headingText}</h4>;
    case 5:
      return <h5 className={smallClasses}>{headingText}</h5>;
    case 6:
      return <h6 className={smallClasses}>{headingText}</h6>;
    default:
      return <h2 className={classes}>{headingText}</h2>;
  }
};

const Paragraphs = ({ text }) => {
  return (
    text.length > 0 &&
    text.map((para, i) => {
      return <p key={i} dangerouslySetInnerHTML={{ __html: para }} />;
    })
  );
};

const LinksList = ({ links }) => {
  return (
    links.length > 0 && (
      <ul
        className={`plain-list ${spacing(
          { s: 2 },
          { margin: ['bottom'] }
        )} ${spacing(
          { s: 0 },
          {
            margin: ['top', 'left', 'right'],
            padding: ['top', 'left', 'right'],
          }
        )}`}
      >
        {links.map((link, i, arr) => (
          <li key={i} className="inline">
            {link.url && <NextLink href={link.url}>{link.text}</NextLink>}
            {!link.url && link}
            {arr.length - 1 !== i && ' '}
          </li>
        ))}
      </ul>
    )
  );
};

type TagsListProps = {
  tags: WorkTagType[],
};

const TagsList = ({ tags }: TagsListProps) => {
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
                <WorkTag className={workTagClasses}>
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

const List = ({ list }) => {
  return (
    list.length > 0 && (
      <ul
        className={`plain-list ${spacing(
          { s: 2 },
          { margin: ['bottom'] }
        )} ${spacing(
          { s: 0 },
          {
            margin: ['top', 'left', 'right'],
            padding: ['top', 'left', 'right'],
          }
        )}`}
      >
        {list.map((item, i, arr) => (
          <li key={i} style={{ listStylePosition: 'inside' }}>
            {item}
          </li>
        ))}
      </ul>
    )
  );
};

type MetaUnitProps = {|
  headingLevel?: number,
  headingText?: string,
  links?: any[], // TODO replace with React.Element<'NextLink'>[], once moved to V2
  tags?: WorkTagType[],
  text?: string[],
  list?: string[],
  children?: Node,
|};

const MetaUnit = ({
  headingLevel,
  headingText,
  text = [],
  links = [],
  tags = [],
  list = [],
  children,
}: MetaUnitProps) => {
  return (
    <div className={`${font({ s: 'HNL4', m: 'HNL3' })}`}>
      {headingText && (
        <Heading headingLevel={headingLevel} headingText={headingText} />
      )}
      <Paragraphs text={text} />
      <LinksList links={links} />
      <List list={list} />
      <TagsList tags={tags} />
      {children}
    </div>
  );
};

export default MetaUnit;
