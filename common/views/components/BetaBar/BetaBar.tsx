import MessageBar from '../MessageBar/MessageBar';
import { FC, ReactElement } from 'react';

const BetaBar: FC = (): ReactElement => (
  <MessageBar tagText={'Beta'}>
    <a href="/works/progress">
      Find out more <span className="visually-hidden">about beta</span>
    </a>
  </MessageBar>
);

export default BetaBar;
