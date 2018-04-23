// TODO: flow!

import {Component} from 'react';
import type {StatelessFunctionalComponent} from 'react';

type TogglerProps = {|
  isActive: boolean | void,
  toggle: (() => void) | void
|}

type TogglerState = {|
  isActive: boolean | void
|}

export function withToggler<Props: {}>(
  WrapperComponent: StatelessFunctionalComponent<Props>
): Class<Component<$Diff<Props, TogglerProps>, TogglerState>> {
  return class extends Component<Props, TogglerState> {
    static displayName = `withToggler(${WrapperComponent.name ? WrapperComponent.name : (WrapperComponent.displayName || '')})`;
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
      return <WrapperComponent {...props} />;
    }
  };
};
