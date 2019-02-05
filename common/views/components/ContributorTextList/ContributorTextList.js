// @flow
import {Fragment} from 'react';
import { spacing, font, classNames } from '../../../utils/classnames';

type Props = {|
  contributors: any[]
|}

const ContributorTextList = ({
  contributors
}: Props) => (
  <p className={classNames({
    [spacing({s: 1}, {margin: ['top']})]: true,
    [spacing({s: 1}, {margin: ['right']})]: true,
    [spacing({s: 0}, {margin: ['bottom']})]: true,
    [font({s: 'HNL4'})]: true
  })}>
    <span>By </span>
    {contributors.map(({ agent }, i, arr) => (
      <Fragment key={agent.label}>
        <span className={classNames({
          'border-color-black': true,
          [font({s: 'HNM4'})]: true,
          'border-left-width-1': i !== 0,
          [spacing({ s: 1 }, { margin: ['left'], padding: ['left'] })]: i !== 0
        })}>{agent.label}</span>
      </Fragment>
    ))}
  </p>
);
export default ContributorTextList;
