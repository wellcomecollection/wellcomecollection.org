// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import {default as BaseHeader, getFeaturedMedia} from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import DateRange from '../DateRange/DateRange';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import HTMLDate from '../HTMLDate/HTMLDate';
import Contributors from '../Contributors/Contributors';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import type {UiInstallation} from '../../../model/installations';

type Props = {|
  installation: UiInstallation,
  showContributorsTitle: boolean
|}

const InstallationPage = ({
  installation
}: Props) => {
  const DateInfo = installation.end ? <DateRange start={installation.start} end={installation.end} /> : <HTMLDate date={installation.start} />;
  const FeaturedMedia = getFeaturedMedia({
    id: installation.id,
    title: installation.title,
    contributors: installation.contributors,
    contributorsTitle: installation.contributorsTitle,
    promo: installation.promo,
    body: installation.body
  });
  const Header = (<BaseHeader
    title={installation.title}
    Background={<WobblyBackground />}
    TagBar={
      <div
        style={{ minHeight: '48px' }}
        data-component='exhibit-exhibition-link'
        className='async-content exhibit-exhibition-link-placeholder'
        data-endpoint={`/installations/${installation.id}/exhibition`}
        data-prefix-endpoint='false'></div>
    }
    DateInfo={DateInfo}
    InfoBar={<StatusIndicator start={installation.start} end={(installation.end || new Date())} />}
    Description={null}
    FeaturedMedia={FeaturedMedia}
  />);

  return (
    <BasePage
      id={installation.id}
      Header={Header}
      Body={<Body body={installation.body} />}
    >
      <Fragment>
        {installation.contributors.length > 0 &&
          <Contributors
            titleOverride={installation.contributorsTitle}
            contributors={installation.contributors} />
        }
      </Fragment>
    </BasePage>
  );
};

export default InstallationPage;
