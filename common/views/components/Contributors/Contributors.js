// @flow
import {Fragment} from 'react';
import {spacing} from '../../../utils/classnames';
import Contributor from '../Contributor/Contributor';
import type {Contributor as ContributorType} from '../../../model/contributors';

type Props = {|
  contributors: ContributorType[]
|}

const Contributors = ({contributors}: Props) => (
  <div className={`${spacing({s: 2}, {padding: ['top']})} border-top-width-1 border-color-smoke`}>
    <h2 className='h2'>Contributors</h2>
    {contributors.map(({contributor, role, description}) => (
      <Fragment key={contributor.id}>
        <Contributor contributor={contributor} role={role} description={description} />
      </Fragment>
    ))}
  </div>
);

export default Contributors;
