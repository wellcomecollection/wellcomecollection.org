// @flow
import {spacing, font, classNames} from '../../../utils/classnames';
import NextLink from 'next/link';
import type {MetaUnitProps} from '../../../model/meta-unit';
import styled from 'styled-components';

const MetaUnitEl = styled.div`
  /* TODO: variables/functions/mixins */
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  padding: 24px 0;
  border-top: 1px solid #d9d6ce;

  &:first-child {
    border-top: 0;
  }

  .meta-unit-heading,
  .meta-unit-body {
    grid-column: 1 / -1
  }

  @media (min-width: 800px) {
    .meta-unit-heading {
      grid-column: span 4;
    }

    .meta-unit-body {
      grid-column: span 6;
    }
  }
`;

type HeadingProps = {
  headingLevel: ?number,
  headingText: string
}
const Heading = ({headingLevel, headingText}: HeadingProps) => {
  const TagName = `h${headingLevel || 2}`;

  return <TagName
    className={classNames({
      [font({s: 'HNM5', m: 'HNM4'})]: true,
      [spacing({s: 0}, {margin: ['top']})]: true,
      [spacing({s: 1}, {margin: ['bottom']})]: true,
      'meta-unit-heading': true
    })}>{headingText}</TagName>;
};

const Paragraphs = ({text}) => {
  return text.length > 0 && text.map((para, i) => {
    return <p key={i} className={`plain-text ${font({s: 'HNL5', m: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`}dangerouslySetInnerHTML={{__html: para}} />;
  });
};

const LinksList = ({links}) => {
  return links.length > 0 &&
  <ul className={`${spacing({s: 2}, {margin: ['bottom']})} ${spacing({s: 0}, {margin: ['top', 'left', 'right'], padding: ['top', 'left', 'right']})}`}>
    {links.map((link, i, arr) => (
      <li key={i} className='inline'>
        {link.url && <NextLink href={link.url}>
          <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>
            {link.text}
          </a>
        </NextLink>
        }
        {!link.url && link}
        {arr.length - 1 !== i && ', '}
      </li>
    ))}
  </ul>;
};

const List = ({list}) => {
  return list.length > 0 &&
  <ul className={`${spacing({s: 2}, {margin: ['bottom']})} ${spacing({s: 0}, {margin: ['top', 'left', 'right'], padding: ['top', 'left', 'right']})}`}>
    {list.map((item, i, arr) => (
      <li key={i} className={font({s: 'HNL5', m: 'HNL4'})} style={{listStylePosition: 'inside'}}>
        {item}
      </li>
    ))}
  </ul>;
};

const MetaUnit = ({headingLevel, headingText, text = [], links = [], list = [], includeDivider}: MetaUnitProps) => {
  return (
    <MetaUnitEl>
      <div className='meta-unit-heading'>
        <Heading headingLevel={headingLevel} headingText={headingText} />
      </div>
      <div className='meta-unit-body spaced-text'>
        <Paragraphs text={text} />
        <LinksList links={links} />
        <List list={list} />
      </div>
    </MetaUnitEl>
  );
};

export default MetaUnit;
