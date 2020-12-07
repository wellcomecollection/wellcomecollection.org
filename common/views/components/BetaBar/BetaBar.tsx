import MessageBar from '../MessageBar/MessageBar';
import { FunctionComponent, ReactElement } from 'react';

const BetaBar: FunctionComponent = (): ReactElement => (
  <MessageBar tagText={'Beta'}>
    This search tool is in development.{' '}
    <a href="/works/progress">Find out more</a>.
  </MessageBar>
);

export default BetaBar;
