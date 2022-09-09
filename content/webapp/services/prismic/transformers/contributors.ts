import { FilledLinkToDocumentField, PrismicDocument } from '@prismicio/types';
import {
  WithContributors,
  isFilledLinkToOrganisationField,
  isFilledLinkToPersonField,
} from '../types';
import {
  isFilledLinkToDocumentWithData,
  InferDataInterface,
} from '@weco/common/services/prismic/types';

import { Contributor, ContributorBasic } from '../../../types/contributors';
import { isNotUndefined } from '@weco/common/utils/array';
import { asRichText, asText } from '.';
import { ImageType } from '@weco/common/model/image';
import { Organisation, Person } from '../types/contributors';
import { transformImage } from '@weco/common/services/prismic/transformers/images';

const defaultContributorImage: ImageType = {
  width: 64,
  height: 64,
  contentUrl:
    'https://images.prismic.io/wellcomecollection%2F021d6105-3308-4210-8f65-d207e04c2cb2_contributor_default%402x.png?auto=compress,format',
  alt: '',
};

function transformCommonFields(
  agent:
    | (FilledLinkToDocumentField<
        'people',
        'en-gb',
        InferDataInterface<Person>
      > & { data: Person })
    | (FilledLinkToDocumentField<
        'organisations',
        'en-gb',
        InferDataInterface<Organisation>
      > & { data: Organisation })
) {
  return {
    id: agent.id,
    description: asRichText(agent.data.description),
    image: transformImage(agent.data.image) || defaultContributorImage,
  };
}

export function transformContributorAgent(
  agent: WithContributors['contributors'][number]['contributor']
): Contributor['contributor'] | undefined {
  if (isFilledLinkToPersonField(agent)) {
    return {
      ...transformCommonFields(agent),
      type: agent.type,
      name: asText(agent.data.name),
      pronouns: asText(agent.data.pronouns),
      sameAs: (agent.data.sameAs ?? [])
        .map(sameAs => {
          const link = asText(sameAs.link);
          const title = asText(sameAs.title);
          return title && link ? { title, link } : undefined;
        })
        .filter(isNotUndefined),
    };
  } else if (isFilledLinkToOrganisationField(agent)) {
    return {
      ...transformCommonFields(agent),
      type: agent.type,
      name: asText(agent.data.name),
      sameAs: (agent.data.sameAs ?? [])
        .map(sameAs => {
          const link = asText(sameAs.link);
          const title = asText(sameAs.title);
          return title && link ? { title, link } : undefined;
        })
        .filter(isNotUndefined),
    };
  } else {
    return undefined;
  }
}

export function transformContributors(
  document: PrismicDocument<WithContributors>
): Contributor[] {
  const { data } = document;
  const contributors = (data.contributors ?? [])
    .map(contributor => {
      const agent = transformContributorAgent(contributor.contributor);

      const roleDocument = isFilledLinkToDocumentWithData(contributor.role)
        ? contributor.role
        : undefined;

      const role = roleDocument
        ? {
            id: roleDocument.id,
            title: asText(roleDocument.data.title),
            describedBy: asText(roleDocument.data.describedBy),
          }
        : undefined;

      const description = asRichText(contributor.description);

      return agent
        ? {
            contributor: agent,
            role,
            description,
          }
        : undefined;
    })
    .filter(isNotUndefined);

  return contributors;
}

export function transformContributorToContributorBasic(
  contributor: Contributor
): ContributorBasic {
  const { type, name } = contributor.contributor;
  return {
    contributor: {
      type,
      name,
    },
  };
}
