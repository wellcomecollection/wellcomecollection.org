import { FunctionComponent, ReactElement } from 'react';
import { classNames, font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';
import {
  WashYourHands,
  KeepYourDistance,
  WearAMask,
  StayAtHome,
  HouseHold,
  CovidIconsEnum,
} from '@weco/common/views/components/CovidIcons/CovidIcons';

type Props = {
  title: string;
  description: ReactElement;
  icon: CovidIconsEnum;
  isStacked?: boolean;
};

const CovidSafetyMeasure: FunctionComponent<Props> = ({
  title,
  description,
  icon,
  isStacked,
}: Props): ReactElement<Props> => {
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
        {icon === CovidIconsEnum.houseHold && <HouseHold />}
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
