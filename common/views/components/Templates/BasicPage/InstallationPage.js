// @flow
import {Fragment} from 'react';
import {spacing} from '../../../../utils/classnames';
import BasicPage from './BasicPage';
import DateRange from '../../DateRange/DateRange';
import StatusIndicator from '../../StatusIndicator/StatusIndicator';
import HTMLDate from '../../HTMLDate/HTMLDate';
import Contributor from '../../Contributor/Contributor';
import type {UiInstallation} from '../../../../model/installations';

type Props = {|
  installation: UiInstallation
|}

const InstallationPage = ({ installation }: Props) => {
  const DateInfo = installation.end ? <DateRange start={installation.start} end={installation.end} /> : <HTMLDate date={installation.start} />;
  // TODO: We really need to sort our typing out
  const description = (installation.promo && installation.promo.caption) || 'MISSING PROMO TEXT';

  return (
    <BasicPage
      DateInfo={DateInfo}
      Description={<p>{description}</p>}
      InfoBar={<StatusIndicator start={installation.start} end={(installation.end || new Date())} />}
      title={installation.title}
      mainImageProps={installation.promo && installation.promo.image}
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
