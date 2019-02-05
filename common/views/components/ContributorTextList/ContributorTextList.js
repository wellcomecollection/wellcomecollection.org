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
    [font({s: 'HNL5'})]: true
  })}>
    {contributors.map(({ agent }, i, arr) => (
      <Fragment key={agent.label}>
        <span className={classNames({
          [font({s: 'HNM5'})]: true
        })}>{agent.label}</span>
        {arr.length > 1 && i < arr.length - 2  && ', '}
        {arr.length > 1 && i === arr.length - 2 && ' and '}
      </Fragment>
    ))}
  </p>
);
export default ContributorTextList;
