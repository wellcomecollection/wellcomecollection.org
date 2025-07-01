import { FunctionComponent } from 'react';

import { getPrismicLicenseData } from '@weco/common/utils/licenses';

const Title: FunctionComponent<{
  title?: string;
  author?: string;
  sourceLink?: string;
}> = ({ title, author, sourceLink }) => {
  if (!title) return null;

  const byAuthor = author ? `, ${author}` : '';

  if (sourceLink) {
    return (
      <>
        <a href={sourceLink} rel="cc:attributionURL">
          {title}
          {byAuthor}
        </a>
        .{' '}
      </>
    );
  } else {
    return (
      <>
        <span>
          {title}
          {byAuthor}.
        </span>{' '}
      </>
    );
  }
};

const Source: FunctionComponent<{
  sourceName?: string;
  sourceLink?: string;
}> = ({ sourceName, sourceLink }) => {
  if (!sourceName) return null;

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
};

const Copyright: FunctionComponent<{
  copyrightHolder?: string;
  copyrightLink?: string;
}> = ({ copyrightHolder, copyrightLink }) => {
  if (!copyrightHolder) return null;

  if (copyrightLink) {
    return (
      <>
        &copy; <a href={copyrightLink}>{copyrightHolder}</a>.{' '}
      </>
    );
  } else {
    return <>&copy; {copyrightHolder}. </>;
  }
};

const License: FunctionComponent<{ license?: string }> = ({ license }) => {
  const licenseData = license && getPrismicLicenseData(license);

  if (!licenseData) return null;

  return (
    <>
      <a rel="license" href={licenseData.url}>
        {licenseData.label}
      </a>
      .
    </>
  );
};

export type MarkupProps = {
  title?: string;
  author?: string;
  sourceName?: string;
  sourceLink?: string;
  license?: string;
  copyrightHolder?: string;
  copyrightLink?: string;
  idSuffix?: string;
};

const TaslMarkup: FunctionComponent<MarkupProps> = ({
  title,
  author,
  sourceName,
  sourceLink,
  license,
  copyrightHolder,
  copyrightLink,
}) => {
  return (
    <>
      <Title title={title} author={author} sourceLink={sourceLink} />
      <Source sourceName={sourceName} sourceLink={sourceLink} />
      <Copyright
        copyrightHolder={copyrightHolder}
        copyrightLink={copyrightLink}
      />
      <License license={license} />
    </>
  );
};

export default TaslMarkup;
