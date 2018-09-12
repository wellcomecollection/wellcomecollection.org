// @flow

import {Fragment} from 'react';
import {font, spacing, classNames} from '../../../utils/classnames';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import type {Node, Element} from 'react';
import type {Link} from '../../../model/link';

type Props = {|
  Breadcrumb?: Element<typeof Breadcrumb>,
  Heading: ?Node,
  TagBar: ?Node,
  DateInfo: ?Node,
  InfoBar: ?Node,
  Description: ?Node,
  topLink: ?Link
|}

const HeaderText = ({
  Breadcrumb,
  topLink,
  TagBar,
  Heading,
  DateInfo,
  Description,
  InfoBar
}: Props) => {
  return (
    <div className={spacing({s: 2}, {padding: ['top']})}>
      <div className={classNames({
        [spacing({s: 4}, {margin: ['top', 'bottom']})]: true
      })}>
        {Breadcrumb}
      </div>
      {topLink &&
        <div className='plain-text'>
          <a className={`${font({s: 'HNL4'})} block`} href={topLink.url}>{topLink.text}</a>
        </div>
      }

      {TagBar &&
        <Fragment>
          {TagBar}
        </Fragment>
      }

      {Heading}

      {DateInfo &&
        <div className={`${font({s: 'HNL3'})}`}>
          {DateInfo}
        </div>
      }

      {Description &&
        <div className={`${font({s: 'HNL4'})} ${spacing({s: 3}, {margin: ['top']})} first-para-no-margin`}>
          {Description}
        </div>
      }

      {InfoBar &&
        <div className={`${font({s: 'HNL4'})} ${spacing({s: 3}, {margin: ['top', 'bottom']})}`}>
          {InfoBar}
        </div>
      }
    </div>
  );
};

export default HeaderText;
