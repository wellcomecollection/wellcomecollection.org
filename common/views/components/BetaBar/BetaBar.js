// @flow
import MessageBar from '../MessageBar/MessageBar';

const BetaBar = () => (
  <MessageBar tagText={'Beta'}>
    This search tool is in development.{' '}
    <a href="/works/progress">Find out more</a>.
  </MessageBar>
);

export default BetaBar;
