// @flow
import NextLink from 'next/link';
import {spacing, font} from '../../../utils/classnames';
import Divider from '../Divider/Divider';
import type {Link} from '../../../model/link';
import type {MetaUnitProps} from '../../../model/meta-unit';

function renderHeading(headingLevel, headingText) {
  const classes = `${font({s: 'HNM5', m: 'HNM4'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`;
  switch (headingLevel) {
    case 1:
      return (<h1 className={classes}>{headingText}</h1>);
    case 2:
      return (<h2 className={classes}>{headingText}</h2>);
    case 3:
      return (<h3 className={classes}>{headingText}</h3>);
    case 4:
      return (<h4 className={classes}>{headingText}</h4>);
    case 5:
      return (<h5 className={classes}>{headingText}</h5>);
    case 6:
      return (<h6 className={classes}>{headingText}</h6>);
    default:
      return (<h2 className={classes}>{headingText}</h2>);
  }
}

function renderParagraphs(text: Array<string>) {
  if (text) {
    return text.map((para, i) => {
      return <p key={i} className={`${font({s: 'HNL5', m: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})}`} dangerouslySetInnerHTML={{__html: para}} />;
    });
  }
}

function renderLinksList(links: Array<Link>) {
  if (links) {
    const listItems = links.map((link, i, arr) =>
      <li key={i} className='inline'>
        <NextLink href={link.url}>
          <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>
            {link.text}
          </a>
        </NextLink>
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

const MetaUnit = ({headingLevel, headingText, text = [], links = [], includeDivider}: MetaUnitProps) => {
  return (
    <div>
      {renderHeading(headingLevel, headingText)}
      {renderParagraphs(text)}
      {renderLinksList(links)}
      {includeDivider &&
      <Divider extraClasses = {`divider--pumice divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />}
    </div>
  );
};

export default MetaUnit;
