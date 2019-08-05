// @flow
import type { Node } from 'react';
import { font, classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Tags, { type TagType } from '../Tags/Tags';
import VerticalSpace from '../styled/VerticalSpace';

type HeadingProps = {
  headingLevel: ?number,
  headingText: string,
};
const Heading = ({ headingLevel, headingText }: HeadingProps) => {
  const classes = `${font('hnm', 5)} no-margin`;
  const smallClasses = `${font('hnm', 5)}`;

  switch (headingLevel) {
    case 1:
      return <h1 className={classes}>{headingText}</h1>;
    case 2:
      return <h2 className={classes}>{headingText}</h2>;
    case 3:
      return <h3 className={classes}>{headingText}</h3>;
    case 4:
      return (
        <VerticalSpace as="h4" size="s" className={smallClasses}>
          {headingText}
        </VerticalSpace>
      );
    case 5:
      return (
        <VerticalSpace as="h5" size="s" className={smallClasses}>
          {headingText}
        </VerticalSpace>
      );
    case 6:
      return (
        <VerticalSpace as="h6" size="s" className={smallClasses}>
          {headingText}
        </VerticalSpace>
      );
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
      <VerticalSpace
        as="ul"
        size="m"
        className={classNames({
          'plain-list no-margin no-padding': true,
        })}
      >
        {links.map((link, i, arr) => (
          <li key={i} className="inline">
            {link.url && <NextLink href={link.url}>{link.text}</NextLink>}
            {!link.url && link}
            {arr.length - 1 !== i && ' '}
          </li>
        ))}
      </VerticalSpace>
    )
  );
};

const List = ({ list }) => {
  return (
    list.length > 0 && (
      <VerticalSpace
        as="ul"
        size="m"
        className={classNames({
          'plain-list no-margin no-padding': true,
        })}
      >
        {list.map((item, i, arr) => (
          <li key={i} style={{ listStylePosition: 'inside' }}>
            {item}
          </li>
        ))}
      </VerticalSpace>
    )
  );
};

type MetaUnitProps = {|
  headingLevel?: number,
  headingText?: string,
  links?: any[], // TODO replace with React.Element<'NextLink'>[], once moved to V2
  tags?: TagType[],
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
      <div className={`${font('hnl', 5)}`}>
        {headingText && (
          <Heading headingLevel={headingLevel} headingText={headingText} />
        )}
        {text.length > 0 && <Paragraphs text={text} />}
        <LinksList links={links} />
        <List list={list} />
        {tags.length > 0 && <Tags tags={tags} />}
        {children}
      </div>
    </SpacingComponent>
  );
};

export default MetaUnit;
