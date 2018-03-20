// @flow

import {font, spacing} from '../../../utils/classnames';
import getLicenseInfo from '../../../utils/get-license-info';
import {Fragment} from 'react';
import Icon from '../Icon/Icon';

type Props = {
  isFull: boolean,
  contentUrl: string,
  title?: ?string,
  author?: ?string,
  sourceName?: ?string,
  sourceLink?: ?string,
  license?: ?string,
  copyrightHolder?: ?string,
  copyrightLink?: ?string
}

function getMarkup(title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink) {
  const licenseInfo = license && getLicenseInfo(license);

  return (
    <Fragment>
      {getTitleHtml(title, author, sourceLink)}
      {getSourceHtml(sourceName, sourceLink)}
      {getCopyrightHtml(copyrightHolder, copyrightLink)}
      {licenseInfo &&
        <Fragment>
          <a rel='license' href={licenseInfo.url}>{licenseInfo.text}</a>.
        </Fragment>
      }
    </Fragment>
  );
}

function getTitleHtml(title, author, sourceLink) {
  if (!title) return;

  const byAuthor = author ? `, ${author}` : '';

  if (sourceLink) {
    return <Fragment><a href={sourceLink} property='dc:title' rel='cc:attributionURL'>{title}{byAuthor}</a>. </Fragment>;
  } else {
    return <Fragment><span property='dc:title'>{title}{byAuthor}.</span> </Fragment>;
  }
}

function getSourceHtml(sourceName, sourceLink) {
  if (!sourceName) return '';

  if (sourceLink) {
    return <Fragment>Source: <a href={sourceLink} rel='cc:attributionURL'>{sourceName}</a>. </Fragment>;
  } else {
    return <Fragment>Source: {sourceName}. </Fragment>;
  }
}

function getCopyrightHtml(copyrightHolder, copyrightLink) {
  if (!copyrightHolder) return '';

  if (copyrightLink) {
    return <Fragment>&copy; <a href={copyrightLink}>{copyrightHolder}</a>. </Fragment>;
  } else {
    return <Fragment>&copy; {copyrightHolder}. </Fragment>;
  }
}

const Tasl = ({isFull, contentUrl, title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink}: Props) => (
  <div className={`
    ${isFull ? 'tasl--top' : 'tasl--bottom'}
    ${font({s: 'LR3', m: 'LR2'})}
    tasl drawer js-show-hide
  `}
  data-track-action="toggle-image-credit"
  data-track-label={`image:${contentUrl}`}>
    {!isFull &&
      <button className="tasl__button plain-button js-show-hide-trigger absolute">
        <span className="tasl__icon tasl__icon--open flex--v-center flex--h-center bg-transparent-black">
          <Icon name='information' title='information' extraClasses='icon--white' />
        </span>
        <span className="tasl__icon tasl__icon--close flex--v-center flex--h-center bg-transparent-black">
          <Icon name='cross' title='close' extraClasses='icon--white' />
        </span>
      </button>
    }

    <div className={`
      drawer__body js-show-hide-drawer bg-black font-white
      ${spacing({s: 1}, {padding: ['top', 'bottom', 'left']})}
      ${spacing({s: 6}, {padding: ['right']})}`}>
      {getMarkup(title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink)}
    </div>
    {isFull &&
      <button className="tasl__button absolute plain-button js-show-hide-trigger">
        <span className="tasl__icon tasl__icon--open flex--v-center flex--h-center bg-transparent-black">
          <Icon name='information' title='information' extraClasses='icon--white' />
        </span>
        <span className="tasl__icon tasl__icon--close flex--v-center flex--h-center bg-transparent-black">
          <Icon name='cross' title='close' extraClasses='icon--white' />
        </span>
      </button>
    }
  </div>
);

export default Tasl;
