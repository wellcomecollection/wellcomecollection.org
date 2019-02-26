// @flow
import type { Node } from 'react';
import { spacing, font } from '../../../utils/classnames';
import NextLink from 'next/link';
import WorkTags, { type WorkTagType } from '../WorkTags/WorkTags';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

type HeadingProps = {
  headingLevel: ?number,
  headingText: string,
};
const Heading = ({ headingLevel, headingText }: HeadingProps) => {
  const classes = `${font({ s: 'HNM5', m: 'HNM4' })} ${spacing(
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

const Paragraphs = ({ text }: { text: string[] }) => {
  return (
    <div className="spaced-text">
      {text.map((para, i) => {
        return <p key={i} dangerouslySetInnerHTML={{ __html: para }} />;
      })}
    </div>
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
    <SpacingComponent>
      <div className={`${font({ s: 'HNL5', m: 'HNL4' })}`}>
        {headingText && (
          <Heading headingLevel={headingLevel} headingText={headingText} />
        )}
        {text.length > 0 && <Paragraphs text={text} />}
        <LinksList links={links} />
        <List list={list} />
        {tags.length > 0 && <WorkTags tags={tags} />}
        {children}
      </div>
    </SpacingComponent>
  );
};

export default MetaUnit;
