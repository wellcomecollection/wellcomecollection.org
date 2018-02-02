// @flow
import {spacing, font} from '../../../utils/classnames';
import Divider from '../Divider/Divider';
import MetaUnit from '../MetaUnit/MetaUnit';
import Icon from '../Icon/Icon';
import type {MetaUnitProps} from '../../../model/meta-unit';

type Props = {|
  data: Array<MetaUnitProps>
|};

const WorkDrawer = ({data}: Props) => {
  const drawerContent = data.map((item, i) => <MetaUnit key={i} headingText={item.headingText} text={item.text} />);
  return (
    <div className='drawer js-show-hide'
      data-track-action='drawer'
      data-track-label='id:work-using-image, section:Using this image'>
      <Divider extraClasses={`divider--black divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
      <button className={`drawer__header plain-button ${spacing({s: 0}, {padding: ['left', 'right']})} ${spacing({s: 2}, {padding: ['top', 'bottom']})} js-show-hide-trigger ${font({s: 'LR2'})}`}>
        <span className='flex flex--v-center flex--h-space-between'>
          <div className='drawer__heading'>Using this image</div>
          <div className='drawer__icon'>
            <Icon name='plus' extraClasses='icon--match-text' />
          </div>
        </span>
      </button>
      <div className={`drawer__body ${spacing({s: 2}, {padding: ['top', 'bottom']})} js-show-hide-drawer ${font({s: 'HNL5', m: 'HNL4'})}`}>
        {drawerContent}
      </div>
      <Divider extraClasses='divider--black divider--keyline' />
    </div>
  );
};

export default WorkDrawer;
