import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import Space from '@weco/common/views/components/styled/Space';
import {WearAMask, BookATicket, CovidIconsEnum} from '@weco/common/views/components/CovidIcons/CovidIcons';
import { classNames, font } from '@weco/common/utils/classNames';

type Props = {
  icon: CovidIconsEnum;
  title: string;
  description: JSX.Element;
  link: 'string';
  linkText: 'string';
}

const CovidInfoCard = ({icon, title, description, link, linkText}) => {
  return (
    <Space
      v={{size: 'l', properties: ['padding-top', 'padding-bottom']}}
      h={{size: 'l', properties: ['padding-left', 'padding-right']}}
      className="bg-cream flex flex--column" style={{height: '100%'}}>
      <div className="margin-h-auto" style={{width: '100px', minWidth: '100px'}}>
        {icon === CovidIconsEnum.wearAMask && <WearAMask />}
        {icon === CovidIconsEnum.bookATicket && <BookATicket />}
      </div>

      <h2 className="h2 text-align-center">{title}</h2>
      <div className="flex flex--column flex-1 flex--h-space-between">
        <div className={classNames({
          [font('hnl', 5)]: true,
        })}>
          {description}
        </div>

        <Space className="flex flex--h-center" v={{size: 'l', properties: ['padding-bottom']}}>
          <ButtonOutlinedLink link={link} text={linkText} icon="arrow" />
        </Space>
      </div>
    </Space>
  )
};

export default CovidInfoCard;
