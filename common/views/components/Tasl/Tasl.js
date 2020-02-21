// @flow
import { font, classNames } from '../../../utils/classnames';
import { getLicenseInfo } from '../../../utils/licenses';
import { trackEvent } from '../../../utils/ga';
import { Fragment, useContext } from 'react';
import { AppContext } from '../../components/AppContext/AppContext';
import { withToggler } from '../../hocs/withToggler';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';

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
            {licenseInfo.label}
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
    const { isEnhanced } = useContext(AppContext);
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

          <Space
            v={{
              size: 's',
              properties: ['padding-top', 'padding-bottom'],
            }}
            h={{ size: 's', properties: ['padding-left'] }}
            className={classNames({
              'bg-black font-white': true,
              'is-hidden': isEnhanced && !isActive,
            })}
            style={{ paddingRight: '36px' }}
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
          </Space>
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
