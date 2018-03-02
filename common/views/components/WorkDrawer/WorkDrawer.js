// @flow
import {Component} from 'react';
import type {ComponentType} from 'react';
import {spacing, font} from '../../../utils/classnames';
import Divider from '../Divider/Divider';
import MetaUnit from '../MetaUnit/MetaUnit';
import Icon from '../Icon/Icon';
import type {MetaUnitProps} from '../../../model/meta-unit';

type TogglerProps = {|
  isActive: boolean,
  toggle: () => void
|}

function withToggler<T>(C: ComponentType<T>): ComponentType<{ ...TogglerProps, ...T }> {
  return class extends Component<{ ...TogglerProps, ...T }, {isActive: boolean}> {
    static displayName = `withToggler(${C.name ? C.name : (C.displayName || '')})`;
    state = {isActive: false};

    toggle = () => {
      this.setState({ isActive: !this.state.isActive });
    }

    render() {
      const props = {
        ...this.props,
        isActive: this.state.isActive,
        toggle: this.toggle
      };
      return <C {...props} />;
    }
  };
};

type Props = {|
  data: Array<MetaUnitProps>,
  isActive: boolean,
  toggle: () => void
|};

const WorkDrawer = withToggler(({data, isActive, toggle}: Props) => {
  const drawerContent = data.map((item, i) => <MetaUnit key={i} headingText={item.headingText} text={item.text} />);
  return (
    <div className={`drawer js-show-hide ${isActive ? 'is-active' : ''}`}
      data-track-action='drawer'
      data-track-label='id:work-using-image, section:Using this image'>
      <Divider extraClasses={`divider--black divider--keyline ${spacing({s: 1}, {margin: ['top', 'bottom']})}`} />
      <button className={`
          js-show-hide-trigger
          drawer__header
          plain-button
          ${spacing({s: 0}, {padding: ['left', 'right']})}
          ${spacing({s: 2}, {padding: ['top', 'bottom']})}
          ${font({s: 'LR2'})}`}
      onClick={toggle}>
        <span className='flex flex--v-center flex--h-space-between'>
          <div className='drawer__heading'>Using this image</div>
          <div className='drawer__icon'>
            <Icon name='plus' extraClasses='icon--match-text' />
          </div>
        </span>
      </button>
      <div className={`
        js-show-hide-drawer
        drawer__body
        ${spacing({s: 2}, {padding: ['top', 'bottom']})}
        ${font({s: 'HNL5', m: 'HNL4'})}`} aria-expanded={isActive ? 'true' : 'false'}>
        {drawerContent}
      </div>
      <Divider extraClasses='divider--black divider--keyline' />
    </div>
  );
});

export default WorkDrawer;
