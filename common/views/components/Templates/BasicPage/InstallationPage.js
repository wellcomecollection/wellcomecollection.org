// @flow
import BasicPage from './BasicPage';
import DateRange from '../../DateRange/DateRange';
import StatusIndicator from '../../StatusIndicator/StatusIndicator';
import type UiInstallation from '../../../../model/installations';

type Props = {|
  installation: UiInstallation
|}

const InstallationPage = ({ installation }: Props) => {
  return (
    <BasicPage
      DateInfo={<DateRange start={installation.start} end={installation.end} />}
      ExtraInfo={<p>{installation.promo.caption}</p>}
      InfoBar={<StatusIndicator start={installation.start} end={installation.end} />}
      title={installation.title}
      mainImageProps={installation.promo.image}
      body={installation.body}>
    </BasicPage>
  );
};

export default InstallationPage;
