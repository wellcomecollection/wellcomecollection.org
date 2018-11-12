// @flow
import {spacing, font} from '../../../utils/classnames';
import NextLink from 'next/link';
import Divider from '../Divider/Divider';
import type {MetaUnitProps} from '../../../model/meta-unit';

function renderHeading(headingLevel, headingText) {
  const classes = `${font({s: 'HNM5', m: 'HNM4'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`;
  const smallClasses = `${font({s: 'HNM6', m: 'HNM5'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`;
  switch (headingLevel) {
    case 1:
      return (<h1 className={classes}>{headingText}</h1>);
    case 2:
      return (<h2 className={classes}>{headingText}</h2>);
    case 3:
      return (<h3 className={smallClasses}>{headingText}</h3>);
    case 4:
      return (<h4 className={smallClasses}>{headingText}</h4>);
    case 5:
      return (<h5 className={smallClasses}>{headingText}</h5>);
    case 6:
      return (<h6 className={smallClasses}>{headingText}</h6>);
    default:
      return (<h2 className={classes}>{headingText}</h2>);
  }
}

function renderParagraphs(text: string[]) {
  if (text) {
    return text.map((para, i) => {
      return <p key={i} className={`plain-text ${font({s: 'HNL5', m: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`} dangerouslySetInnerHTML={{__html: para}} />;
    });
  }
}

function renderLinksList(links: any[]) { // TODO replace with React.Element<'NextLink'>[] once switched to V2
  if (links.length > 0) {
    const listItems = links.map((link, i, arr) =>
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
    );
    return (
      <ul className={`plain-list ${spacing({s: 2}, {margin: ['bottom']})} ${spacing({s: 0}, {margin: ['top', 'left', 'right'], padding: ['top', 'left', 'right']})}`}>
        {listItems}
      </ul>
    );
  }
}

function renderList(list: string[]) {
  if (list.length > 0) {
    const listItems = list.map((link, i, arr) =>
      <li key={i} className={font({s: 'HNL5', m: 'HNL4'})} style={{'list-style-position': 'inside'}}>
        {link}
      </li>
    );
    return (
      <ul className={`${spacing({s: 2}, {margin: ['bottom']})} ${spacing({s: 0}, {margin: ['top', 'left', 'right'], padding: ['top', 'left', 'right']})}`}>
        {listItems}
      </ul>
    );
  }
}

const MetaUnit = ({headingLevel, headingText, text = [], links = [], list = [], includeDivider}: MetaUnitProps) => {
  return (
    <div>
      {renderHeading(headingLevel, headingText)}
      {renderParagraphs(text)}
      {renderLinksList(links)}
      {renderList(list)}
      {includeDivider &&
      <Divider extraClasses = {`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />}
    </div>
  );
};

export default MetaUnit;
