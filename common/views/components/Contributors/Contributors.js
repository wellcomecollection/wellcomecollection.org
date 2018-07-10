// @flow
import {spacing} from '../../../utils/classnames';
import Contributor from '../Contributor/Contributor';
import type {Contributor as ContributorType} from '../../../model/contributors';

type Props = {|
  contributors: ContributorType[],
  titleOverride: ?string,
  titlePrefix?: string,
  excludeTitle?: boolean
|}

export function getContributorsTitle(
  contributors: ContributorType[],
  titlePrefix: string = 'About the',
  flattenRoles: boolean = true
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

  const roles = Object.keys(roleCounts).reduce((acc, role, i, roles) => {
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

  const rolesString = flattenRoles && Object.keys(roleCounts).length > 1 ? 'contributors' : roles;

  return `${titlePrefix} ${rolesString}`;
}

const Contributors = ({
  contributors,
  titleOverride,
  excludeTitle,
  titlePrefix = 'About the'
}: Props) => (
  <div className={`${spacing({s: 2}, {padding: ['top']})} border-top-width-1 border-color-smoke`}>
    {titleOverride && <h2 className='h2'>{titleOverride}</h2>}
    {!titleOverride && !excludeTitle &&
      <h2 className='h2'>
        {`${getContributorsTitle(contributors, titlePrefix)}`}
      </h2>
    }
    {contributors.map(({contributor, role, description}) => (
      <div className={spacing({s: 2}, {margin: ['top']})} key={contributor.id}>
        <Contributor
          contributor={contributor}
          role={role}
          description={description} />
      </div>
    ))}
  </div>
);

export default Contributors;
