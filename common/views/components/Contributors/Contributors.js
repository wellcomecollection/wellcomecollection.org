// @flow
import {Fragment} from 'react';
import Contributor from '../Contributor/Contributor';
import type {Contributor as ContributorType} from '../../../model/contributors';

type Props = {|
  contributors: ContributorType[],
  titlePrefix?: string,
  excludeTitle?: boolean
|}

export function getContributorsTitle(
  contributors: ContributorType[]
): string {
  // We've been guarenteed that we'll only get speaker, guide, and facilitator,
  // so the pluralisation works here.
  const roleCounts = contributors.map(contributor => contributor.role && contributor.role.title)
    .filter(Boolean)
    .reduce((acc, role) => {
      if (!acc.hasOwnProperty(role)) {
        acc[role] = 0;
      }
      acc[role]++;
      return acc;
    }, {});

  // This is basic, but makes sense
  if (roleCounts.hasOwnProperty('Partner')) {
    return 'In partnership with';
  }

  return Object.keys(roleCounts).reduce((acc, role, i, roles) => {
    const postFix =
        // The second last of many
        roles.length !== 1 && i === roles.length - 2 ? ' and '
        // Not the last of many
          : roles.length !== 1 && i < roles.length - 2 ? ', '
          // There's only 1
            : '';

    const pluralisedS = roleCounts[role] > 1 ? 's' : '';
    return acc + role.toLowerCase() + pluralisedS + postFix;
  }, '');
}

const Contributors = ({
  contributors,
  titlePrefix = 'About the',
  excludeTitle
}: Props) => (
  <Fragment>
    {!excludeTitle && <h2 className='h2'>
      {`${titlePrefix} ${getContributorsTitle(contributors)}`}
    </h2>}
    {contributors.map(({contributor, role, description}) => (
      <Fragment key={contributor.id}>
        <Contributor contributor={contributor} role={role} description={description} />
      </Fragment>
    ))}
  </Fragment>
);

export default Contributors;
