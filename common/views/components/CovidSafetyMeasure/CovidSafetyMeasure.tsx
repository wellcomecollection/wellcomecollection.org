import { classNames, font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';
import {
  WashYourHands,
  KeepYourDistance,
  WearAMask,
  StayAtHome,
  CovidIconsEnum,
} from '@weco/common/views/components/CovidIcons/CovidIcons';

type Props = {
  title: string;
  description: JSX.Element;
  icon: CovidIconsEnum;
  isStacked?: boolean;
};

const CovidSafetyMeasure = ({ title, description, icon, isStacked }: Props) => {
  return (
    <div
      className={classNames({
        flex: true,
        'flex--wrap': isStacked,
        'flex--h-center': isStacked,
        'flex--v-center': !isStacked,
      })}
    >
      <Space
        h={{ size: 'm', properties: [!isStacked ? 'margin-right' : null] }}
        className={classNames({
          'no-margin': true,
        })}
        style={{ width: '80px', minWidth: '80px' }}
      >
        {icon === CovidIconsEnum.washYourHands && <WashYourHands />}
        {icon === CovidIconsEnum.keepYourDistance && <KeepYourDistance />}
        {icon === CovidIconsEnum.wearAMask && <WearAMask />}
        {icon === CovidIconsEnum.stayAtHome && <StayAtHome />}
      </Space>
      <div
        className={classNames({
          'no-margin': true,
          'text-align-center': isStacked,
        })}
        style={{ width: isStacked ? '100%' : 'auto' }}
      >
        <h3 className="h3">{title}</h3>
        <p
          className={classNames({
            [font('hnl', 5)]: true,
          })}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default CovidSafetyMeasure;
