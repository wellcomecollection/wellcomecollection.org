// @flow
import {Fragment} from 'react';
import {spacing} from '../../../../utils/classnames';
import BasicPage from './BasicPage';
import DateRange from '../../DateRange/DateRange';
import StatusIndicator from '../../StatusIndicator/StatusIndicator';
import HTMLDate from '../../HTMLDate/HTMLDate';
import Contributor from '../../Contributor/Contributor';
import WobblyBackground from './WobblyBackground';
import {UiImage} from '../../Images/Images';
import type {UiInstallation} from '../../../../model/installations';

type Props = {|
  installation: UiInstallation
|}

const InstallationPage = ({ installation }: Props) => {
  const DateInfo = installation.end ? <DateRange start={installation.start} end={installation.end} /> : <HTMLDate date={installation.start} />;
  const image = installation.promo && installation.promo.image;
  const tasl = image && {
    isFull: false,
    contentUrl: image.contentUrl,
    title: image.title,
    author: image.author,
    sourceName: image.source && image.source.name,
    sourceLink: image.source && image.source.link,
    license: image.license,
    copyrightHolder: image.copyright && image.copyright.holder,
    copyrightLink: image.copyright && image.copyright.link
  };
  /* https://github.com/facebook/flow/issues/2405 */
  /* $FlowFixMe */
  const FeaturedMedia = installation.promo && <UiImage tasl={tasl} {...image} />;

  return (
    <BasicPage
      Background={WobblyBackground()}
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
      title={installation.title}
      body={installation.body}>

      <Fragment>
        <div className={`${spacing({s: 2}, {padding: ['top']})} border-top-width-1 border-color-smoke`}>
          {installation.contributors.length > 0 &&
            <h2 className='h2'>Contributors</h2>
          }
          {installation.contributors.map(({contributor, role, description}) => (
            <Fragment key={contributor.id}>
              <Contributor contributor={contributor} role={role} description={description} />
            </Fragment>
          ))}
        </div>
      </Fragment>
    </BasicPage>
  );
};

export default InstallationPage;
