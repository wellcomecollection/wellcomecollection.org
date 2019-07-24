// @flow

import { font, spacing } from '../../../utils/classnames';
import getLicenseInfo from '../../../utils/get-license-info';
import { trackEvent } from '../../../utils/ga';
import { Fragment } from 'react';
import { withToggler } from '../../hocs/withToggler';
import Icon from '../Icon/Icon';
import VerticalSpace from '../styled/VerticalSpace';

export type Props = {
  isFull: boolean,
  title?: ?string,
  author?: ?string,
  sourceName?: ?string,
  sourceLink?: ?string,
  license?: ?string,
  copyrightHolder?: ?string,
  copyrightLink?: ?string,
  isActive: boolean,
  toggle: () => void,
};

function getMarkup(
  title,
  author,
  sourceName,
  sourceLink,
  license,
  copyrightHolder,
  copyrightLink
) {
  const licenseInfo = license && getLicenseInfo(license);

  return (
    <Fragment>
      {getTitleHtml(title, author, sourceLink)}
      {getSourceHtml(sourceName, sourceLink)}
      {getCopyrightHtml(copyrightHolder, copyrightLink)}
      {licenseInfo && (
        <Fragment>
          <a rel="license" href={licenseInfo.url}>
            {licenseInfo.text}
          </a>
          .
        </Fragment>
      )}
    </Fragment>
  );
}

function getTitleHtml(title, author, sourceLink) {
  if (!title) return;

  const byAuthor = author ? `, ${author}` : '';

  if (sourceLink) {
    return (
      <Fragment>
        <a href={sourceLink} property="dc:title" rel="cc:attributionURL">
          {title}
          {byAuthor}
        </a>
        .{' '}
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <span property="dc:title">
          {title}
          {byAuthor}.
        </span>{' '}
      </Fragment>
    );
  }
}

function getSourceHtml(sourceName, sourceLink) {
  if (!sourceName) return '';

  if (sourceLink) {
    return (
      <Fragment>
        Source:{' '}
        <a href={sourceLink} rel="cc:attributionURL">
          {sourceName}
        </a>
        .{' '}
      </Fragment>
    );
  } else {
    return <Fragment>Source: {sourceName}. </Fragment>;
  }
}

function getCopyrightHtml(copyrightHolder, copyrightLink) {
  if (!copyrightHolder) return '';

  if (copyrightLink) {
    return (
      <Fragment>
        &copy; <a href={copyrightLink}>{copyrightHolder}</a>.{' '}
      </Fragment>
    );
  } else {
    return <Fragment>&copy; {copyrightHolder}. </Fragment>;
  }
}

const Tasl = withToggler(
  ({
    isFull,
    title,
    author,
    sourceName,
    sourceLink,
    license,
    copyrightHolder,
    copyrightLink,
    toggle,
    isActive,
  }: Props) => {
    function toggleWithAnalytics(event) {
      event.preventDefault();
      trackEvent({
        category: 'Tasl',
        action: isActive ? 'closed' : 'opened',
        label: title || 'no title',
      });

      toggle();
    }

    return (
      [title, sourceName, copyrightHolder].some(_ => _) && (
        <div
          className={`
      ${isFull ? 'tasl--top' : 'tasl--bottom'}
      ${font('lr', 6)}
      ${isActive ? 'is-active' : ''}
      tasl drawer plain-text
    `}
        >
          {!isFull && (
            <button
              onClick={toggleWithAnalytics}
              className="tasl__button plain-button absolute"
            >
              <span className="tasl__icon tasl__icon--open flex--v-center flex--h-center bg-transparent-black">
                <Icon
                  name="information"
                  title="information"
                  extraClasses="icon--white"
                />
                <span className="visually-hidden">information</span>
              </span>
              <span className="tasl__icon tasl__icon--close flex--v-center flex--h-center bg-transparent-black">
                <Icon name="cross" title="close" extraClasses="icon--white" />
              </span>
            </button>
          )}

          <VerticalSpace
            size="s"
            properties={['padding-top', 'padding-bottom']}
            className={`
              drawer__body bg-black font-white
              ${spacing({ s: 1 }, { padding: ['left'] })}
              ${spacing({ s: 6 }, { padding: ['right'] })}`}
          >
            {getMarkup(
              title,
              author,
              sourceName,
              sourceLink,
              license,
              copyrightHolder,
              copyrightLink
            )}
          </VerticalSpace>
          {isFull && (
            <button
              onClick={toggleWithAnalytics}
              className="tasl__button absolute plain-button"
            >
              <span className="tasl__icon tasl__icon--open flex--v-center flex--h-center bg-transparent-black">
                <Icon
                  name="information"
                  title="information"
                  extraClasses="icon--white"
                />
                <span className="visually-hidden">information</span>
              </span>
              <span className="tasl__icon tasl__icon--close flex--v-center flex--h-center bg-transparent-black">
                <Icon name="cross" title="close" extraClasses="icon--white" />
              </span>
            </button>
          )}
        </div>
      )
    );
  }
);

export default Tasl;
