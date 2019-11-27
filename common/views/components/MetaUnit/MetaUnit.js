// @flow
import type { Node } from 'react';
import { font, classNames } from '../../../utils/classnames';
import NextLink from 'next/link';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Tags, { type TagType } from '../Tags/Tags';
import Space from '../styled/Space';

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
      <Space
        v={{
          size: 'm',
          properties: ['margin-bottom'],
        }}
        as="ul"
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
      </Space>
    )
  );
};

const List = ({ list }) => {
  return (
    list.length > 0 && (
      <Space
        v={{
          size: 'm',
          properties: ['margin-bottom'],
        }}
        as="ul"
        className={classNames({
          'plain-list no-margin no-padding': true,
        })}
      >
        {list.map((item, i, arr) => (
          <li key={i} style={{ listStylePosition: 'inside' }}>
            {item}
          </li>
        ))}
      </Space>
    )
  );
};

type MetaUnitProps = {|
  headingText?: string,
  links?: any[], // TODO replace with React.Element<'NextLink'>[], once moved to V2
  tags?: TagType[],
  text?: string[],
  list?: string[],
  children?: Node,
|};

const MetaUnit = ({
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
          <h3 className={`${font('hnm', 5)} no-margin`}>{headingText}</h3>
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
