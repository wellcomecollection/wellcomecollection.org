import {
  FilledLinkToDocumentField,
  PrismicDocument,
  FilledImageFieldImage,
} from '@prismicio/types';
import * as prismicH from 'prismic-helpers-beta';
import { isFilledLinkToDocumentWithData, isFilledLinkToPersonField, WithContributors, InferDataInterface, isFilledLinkToOrganisationField, DataInterface } from '../types';
import { Contributor } from '../../../types/contributors';
import { isNotUndefined } from '@weco/common/utils/array';
import {
  asRichText,
  asText,
} from '.';
import { transformImage } from './images';
import { ImageType } from '@weco/common/model/image';
import { Organisation, Person } from '../types/contributors';

const defaultContributorImage: ImageType = {
  width: 64,
  height: 64,
  contentUrl: 'https://images.prismic.io/wellcomecollection%2F021d6105-3308-4210-8f65-d207e04c2cb2_contributor_default%402x.png?auto=compress,format',
  alt: '',
  crops: {},
};

function transformCommonFields(agent:
  | FilledLinkToDocumentField<'people', 'en-gb', InferDataInterface<Person>> & { data: Person }
  | FilledLinkToDocumentField<'organisations', 'en-gb', InferDataInterface<Organisation>> & { data: Organisation }) {
  return {
    id: agent.id,
    description: transformRichTextField(agent.data.description),
    image: agent.data.image || defaultContributorImage,
  };
}

export function transformContributorAgent(
  agent: WithContributors['contributors'][number]['contributor']
): Contributor['contributor'] | undefined {
<<<<<<< HEAD
  if (isFilledLinkToDocumentWithData(agent)) {
    const commonFields = {
      id: agent.id,
      description: asRichText(agent.data.description),
      image: transformImage(agent.data.image) || defaultContributorImage,
      sameAs: (agent.data.sameAs ?? [])
        .map(sameAs => {
          const link = asText(sameAs.link);
          const title = prismicH.asText(sameAs.title);
          return title && link ? { title, link } : undefined;
        })
        .filter(isNotUndefined),
    };

    // The .name field can be either RichText or Text.
    const name = isString(agent.data.name)
      ? asText(agent.data.name)
      : Array.isArray(agent.data.name)
      ? asText(agent.data.name)
      : undefined;

    if (agent.type === 'organisations') {
      return {
        type: agent.type,
        name,
        ...commonFields,
      };
    } else if (agent.type === 'people') {
      return {
        type: agent.type,
        name,
        ...commonFields,
        // I'm not sure why I have to coerce this type here as it is that type?
        pronouns: asText(agent.data.pronouns as KeyTextField),
      };
    }
=======
  if (isFilledLinkToPersonField(agent)) {
    return {
      ...transformCommonFields(agent),
      type: agent.type,
      name: transformKeyTextField(agent.data.name),
      pronouns: transformKeyTextField(agent.data.pronouns),
      sameAs: (agent.data.sameAs ?? [])
      .map(sameAs => {
        const link = transformKeyTextField(sameAs.link);
        const title = transformRichTextFieldToString(sameAs.title);
        return title && link ? { title, link } : undefined;
      })
      .filter(isNotUndefined)
    };
  } else if (isFilledLinkToOrganisationField(agent)) {
    return {
      ...transformCommonFields(agent),
      type: agent.type,
      name: transformRichTextFieldToString(agent.data.name),
      sameAs: (agent.data.sameAs ?? [])
      .map(sameAs => {
        const link = transformKeyTextField(sameAs.link);
        const title = transformKeyTextField(sameAs.title);
        return title && link ? { title, link } : undefined;
      })
      .filter(isNotUndefined)
    };
  } else {
    return undefined;
>>>>>>> Split the types for transforming contributors
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
