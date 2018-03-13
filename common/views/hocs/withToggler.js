import {Component} from 'react';
import type {ComponentType} from 'react';

type TogglerProps = {|
  isActive: boolean,
  toggle: () => void
|}

export function withToggler<T>(C: ComponentType<T>): ComponentType<{ ...TogglerProps, ...T }> {
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
