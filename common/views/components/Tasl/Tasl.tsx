import { FunctionComponent, useContext, useState } from 'react';
import { font, classNames } from '../../../utils/classnames';
import { getLicenseInfo } from '../../../utils/licenses';
import { trackEvent } from '../../../utils/ga';
import { AppContext } from '../../components/AppContext/AppContext';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';

type MarkUpProps = {
  title?: string | null;
  author?: string | null;
  sourceName?: string | null;
  sourceLink?: string | null;
  license?: string | null;
  copyrightHolder?: string | null;
  copyrightLink?: string | null;
};

function getMarkup({
  title,
  author,
  sourceName,
  sourceLink,
  license,
  copyrightHolder,
  copyrightLink,
}: MarkUpProps) {
  const licenseInfo = license && getLicenseInfo(license);

  return (
    <>
      {getTitleHtml(title, author, sourceLink)}
      {getSourceHtml(sourceName, sourceLink)}
      {getCopyrightHtml(copyrightHolder, copyrightLink)}
      {licenseInfo && (
        <>
          <a rel="license" href={licenseInfo.url}>
            {licenseInfo.label}
          </a>
          .
        </>
      )}
    </>
  );
}

function getTitleHtml(title, author, sourceLink) {
  if (!title) return;

  const byAuthor = author ? `, ${author}` : '';

  if (sourceLink) {
    return (
      <>
        <a href={sourceLink} property="dc:title" rel="cc:attributionURL">
          {title}
          {byAuthor}
        </a>
        .{' '}
      </>
    );
  } else {
    return (
      <>
        <span property="dc:title">
          {title}
          {byAuthor}.
        </span>{' '}
      </>
    );
  }
}

function getSourceHtml(sourceName, sourceLink) {
  if (!sourceName) return '';

  if (sourceLink) {
    return (
      <>
        Source:{' '}
        <a href={sourceLink} rel="cc:attributionURL">
          {sourceName}
        </a>
        .{' '}
      </>
    );
  } else {
    return <>Source: {sourceName}. </>;
  }
}

function getCopyrightHtml(copyrightHolder, copyrightLink) {
  if (!copyrightHolder) return '';

  if (copyrightLink) {
    return (
      <>
        &copy; <a href={copyrightLink}>{copyrightHolder}</a>.{' '}
      </>
    );
  } else {
    return <>&copy; {copyrightHolder}. </>;
  }
}

export type Props = MarkUpProps & {
  isFull: boolean;
  isActive: boolean;
  toggle: () => void;
};

const Tasl: FunctionComponent<Props> = ({
  isFull,
  title,
  author,
  sourceName,
  sourceLink,
  license,
  copyrightHolder,
  copyrightLink,
}: Props) => {
  const { isEnhanced } = useContext(AppContext);
  const [isActive, setIsActive] = useState(false);
  function toggleWithAnalytics(event) {
    event.preventDefault();
    trackEvent({
      category: 'Tasl',
      action: isActive ? 'closed' : 'opened',
      label: title || 'no title',
    });

    setIsActive(!isActive);
  }

  return [title, sourceName, copyrightHolder].some(_ => _) ? (
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
          <span className="tasl__icon tasl__icon--open flex--v-center flex--h-center bg-transparent-black font-white">
            <Icon
              name="information"
              title="information"
              extraClasses="icon--white"
            />
            <span className="visually-hidden">information</span>
          </span>
          <span className="tasl__icon tasl__icon--close flex--v-center flex--h-center bg-transparent-black font-white">
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
        {getMarkup({
          title,
          author,
          sourceName,
          sourceLink,
          license,
          copyrightHolder,
          copyrightLink,
        })}
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
  ) : null;
};

export default Tasl;
