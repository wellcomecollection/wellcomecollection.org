// @flow
import BasicPage from './BasicPage';
import DateRange from '../../DateRange/DateRange';
import StatusIndicator from '../../StatusIndicator/StatusIndicator';
import HTMLDate from '../../HTMLDate/HTMLDate';
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
    </BasicPage>
  );
};

export default InstallationPage;
