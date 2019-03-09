// @flow
import styled from 'styled-components';
import { classNames, font, spacing } from '../../../utils/classnames';

const BetaTag = styled(({ className }) => (
  <span
    className={classNames({
      [className]: true,
      caps: true,
      'bg-purple': true,
      'font-white': true,
      [font({ s: 'HNM5' })]: true,
      [spacing({ s: 1 }, { margin: ['right'] })]: true,
    })}
  >
    Beta
  </span>
))`
  display: inline-block;
  padding: 0.2em 0.5em;
`;

const BetaBar = () => (
  <div
    className={classNames({
      [font({ s: 'HNL4' })]: true,
      [spacing({ s: 3 }, { padding: ['top', 'bottom'] })]: true,
    })}
  >
    <BetaTag />
    We’re improving how search works.{' '}
    <a href="/works/progress">Find out more</a>.
  </div>
);

export default BetaBar;
