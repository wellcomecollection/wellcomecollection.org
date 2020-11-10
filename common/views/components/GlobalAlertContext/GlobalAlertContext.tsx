import { Component, createContext, ReactNode } from 'react';
import { HTMLString } from '@weco/common/services/prismic/types';
const GlobalAlertContext = createContext(null);

type GlobalObject = {
  isShown: boolean | null;
  routeRegex: string | null;
  text: HTMLString;
};

type Props = {
  value: GlobalObject;
  children: ReactNode;
};

type State = {
  isShown: boolean | null;
  routeRegex: string | null;
  infoBanner: boolean;
};

export class GlobalAlertContextProvider extends Component<Props, State> {
  setInfoBanner = (value: boolean) => {
    this.setState({
      ...this.state,
      infoBanner: value,
    });
  };

  // initial context value
  state = {
    infoBanner: false,
    isShown: this.props.value.isShown,
    routeRegex: this.props.value.routeRegex,
    text: this.props.value.text,
    setInfoBanner: this.setInfoBanner,
  };

  render() {
    //Passing the state object as a value prop to all children
    return (
      <GlobalAlertContext.Provider value={this.state}>
        {this.props.children}
      </GlobalAlertContext.Provider>
    );
  }
}

export default GlobalAlertContext;
