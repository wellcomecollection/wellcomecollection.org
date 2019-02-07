// @flow
import type { Node } from 'react';
import { spacing, font } from '../../../utils/classnames';
import NextLink from 'next/link';
import Divider from '../Divider/Divider';

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
      return (
        <p
          key={i}
          className={spacing({ s: 2 }, { margin: ['bottom'] })}
          dangerouslySetInnerHTML={{ __html: para }}
        />
      );
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
  text?: string[],
  list?: string[],
  children?: Node,
|};

const MetaUnit = ({
  headingLevel,
  headingText,
  text = [],
  links = [],
  list = [],
  children,
}: MetaUnitProps) => {
  return (
    <div
      className={`${spacing({ s: 4 }, { margin: ['bottom'] })} ${font({
        s: 'HNL4',
        m: 'HNL3',
      })}`}
    >
      {headingText && (
        <Heading headingLevel={headingLevel} headingText={headingText} />
      )}
      <Paragraphs text={text} />
      <LinksList links={links} />
      <List list={list} />
      {children}
    </div>
  );
};

export default MetaUnit;
