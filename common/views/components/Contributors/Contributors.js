// @flow
import Contributor from '../Contributor/Contributor';
import { Fragment } from 'react';
import type { Contributor as ContributorType } from '../../../model/contributors';
import Space from '../styled/Space';

type Props = {|
  contributors: ContributorType[],
  titleOverride?: ?string,
  titlePrefix?: string,
  excludeTitle?: boolean,
|};

export function dedupeAndPluraliseRoles(roles: string[]) {
  const dedupedWithCount: { [string]: number } = roles
    .filter(Boolean)
    .reduce((acc, role) => {
      if (!acc.hasOwnProperty(role)) {
        acc[role] = 0;
      }
      acc[role]++;
      return acc;
    }, {});

  // We've been guarenteed that we'll only get speaker, guide, and facilitator,
  // so the pluralisation works here.
  const pluralised: string[] = Object.keys(dedupedWithCount).map(role => {
    const count = dedupedWithCount[role];
    return count > 1 ? `${role}s` : role;
  }, []);

  return pluralised;
}

export function getContributorsTitle(
  roles: string[],
  titlePrefix: string = 'About the'
): string {
  const lowerCaseRoles = roles.map(role => role.toLowerCase());

  // This is basic, but makes sense
  if (roles.indexOf('Partner') !== -1) {
    return 'In partnership with';
  }

  const rolesString =
    lowerCaseRoles.length === 1 ? lowerCaseRoles[0] : 'contributors';

  return `${titlePrefix} ${rolesString}`;
}

const Contributors = ({
  contributors,
  titleOverride,
  excludeTitle,
  titlePrefix = 'About the',
}: Props) => {
  const roles = dedupeAndPluraliseRoles(
    contributors
      .map(contributor => contributor.role && contributor.role.title)
      .filter(Boolean)
  );

  return (
    <Fragment>
      {titleOverride && <h2 className="h2">{titleOverride}</h2>}
      {!titleOverride && !excludeTitle && (
        <h2 className="h2">{`${getContributorsTitle(roles, titlePrefix)}`}</h2>
      )}

      {contributors.map(({ contributor, role, description }) => (
        <Space
          v={{ size: 'l', properties: ['margin-bottom'] }}
          key={contributor.id}
        >
          {/*
            we don't show the role if there is only 1 as it will be
            displayed in the title
          */}
          <Contributor
            contributor={contributor}
            role={roles.length > 1 ? role : null}
            description={description}
          />
        </Space>
      ))}
    </Fragment>
  );
};

export default Contributors;
