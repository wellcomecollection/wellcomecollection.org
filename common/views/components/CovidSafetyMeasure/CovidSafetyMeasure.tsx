import {classNames, font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';
import {WashYourHands, KeepYourDistance, WearAMask, StayAtHome} from '@weco/common/views/components/CovidIcons/CovidIcons';

enum CovidIcons {
  washYourHands = 'washYourHands',
  keepYourDistance = 'keepYourDistance',
  wearAMask = 'wearAMask',
  stayAtHome = 'stayAtHome'
};

type Props = {
  title: string;
  description: string;
  icon: CovidIcons;
  isStacked?: boolean;
};

const CovidList = ({title, description, icon, isStacked}: Props) => {
  return (
    <div className={classNames({
      'flex': true,
      'flex--wrap': isStacked,
      'flex--h-center': isStacked,
    })}>
      <Space h={{size: 'm', properties: [!isStacked ? 'margin-right' : null]}} className={classNames({
        'no-margin': true,
      })} style={{width: '80px', minWidth: '80px'}}>
        {icon === CovidIcons.washYourHands && <WashYourHands />}
        {icon === CovidIcons.keepYourDistance && <KeepYourDistance />}
        {icon === CovidIcons.wearAMask && <WearAMask />}
        {icon === CovidIcons.stayAtHome && <StayAtHome />}
      </Space>
      <div className={classNames({
        'no-margin': true,
        'text-align-center': isStacked,
      })} style={{width: isStacked ? '100%' : 'auto'}}>
        <h3>{title}</h3>
        <p className={classNames({
          [font('hnl', 5)]: true,
        })}>{description}</p>
      </div>
    </div>
  )
};

export default CovidList;
