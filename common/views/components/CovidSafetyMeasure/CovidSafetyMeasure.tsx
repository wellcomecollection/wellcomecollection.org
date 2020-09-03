import {classNames, grid, font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';

type Props = {
  title: string;
  description: string;
  image: string;
  isStacked?: boolean;
}

const CovidList = ({title, description, image, isStacked}: Props) => {
  const descriptionGrid = isStacked ? { s: 10, shiftS: 1, m: 10, shiftM: '1', l: 10, shiftL: '1', xl: 10, shiftXl: '1'} : { s: 10, m: 10, l: 10, xl: 10};
  return (
    <div className={classNames({
      'flex': true,
      'flex--wrap': isStacked,
      'flex--h-center': isStacked,
    })}>
      <Space h={{size: 'm', properties: [!isStacked ? 'margin-right' : null]}} className={classNames({
        'no-margin': true,
      })} style={{width: '80px', minWidth: '80px'}}>
        <img src={image} />
      </Space>
      <div className={classNames({
        'no-margin': true,
        'text-align-center': isStacked,
      })} style={{width: isStacked ? '100%' : 'auto'}}>
        <h3><span className={classNames({
          [font('hnm', 4)]: true,
        })}>{title}</span></h3>
        <p>{description}</p>
      </div>
    </div>
  )
};

export default CovidList;
