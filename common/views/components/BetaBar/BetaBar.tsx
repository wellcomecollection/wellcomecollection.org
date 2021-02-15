import MessageBar from '../MessageBar/MessageBar';
import { FunctionComponent, ReactElement } from 'react';

const BetaBar: FunctionComponent = (): ReactElement => (
  <MessageBar tagText={'Beta'}>
    <a href="/works/progress">
      Find out more <span className="visually-hidden">about beta</span>
    </a>
  </MessageBar>
);

export default BetaBar;
