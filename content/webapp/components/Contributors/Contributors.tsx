import { Fragment, FunctionComponent } from 'react';
import { isNotUndefined } from '@weco/common/utils/array';
import Space from '@weco/common/views/components/styled/Space';
import Contributor from './Contributor';
import { Contributor as ContributorType } from '../../types/contributors';

type Props = {
  titlePrefix?: string;
  contributors: ContributorType[];
  titleOverride?: string;
};

export function dedupeAndPluraliseRoles(roles: string[]): string[] {
  const dedupedWithCount: { [key: string]: number } = roles
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
  titlePrefix = 'About the'
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

const Contributors: FunctionComponent<Props> = ({
  titlePrefix = 'About the',
  contributors,
  titleOverride,
}: Props) => {
  // The transformContributors() method will remove contributors that don't
  // have any visible fields.
  //
  // This means we may be in a situation where `document.contributors` is
  // non-empty but `contributors` is empty, in which case we don't want to
  // render anything at all.
  if (contributors.length === 0) {
    return null;
  }

  const roles = dedupeAndPluraliseRoles(
    contributors
      .map(contributor => contributor?.role?.title)
      .filter(isNotUndefined)
  );

  return (
    <Fragment>
      {titleOverride && <h2 className="h2">{titleOverride}</h2>}
      {!titleOverride && (
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
            role={roles.length > 1 ? role : undefined}
            description={description}
          />
        </Space>
      ))}
    </Fragment>
  );
};

export default Contributors;
