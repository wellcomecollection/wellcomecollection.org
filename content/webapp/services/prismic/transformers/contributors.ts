import { PrismicDocument, KeyTextField } from '@prismicio/types';
import * as prismicH from 'prismic-helpers-beta';
import { isFilledLinkToDocumentWithData, WithContributors } from '../types';
import { Contributor } from '../../../types/contributors';
import { isNotUndefined } from '@weco/common/utils/array';
import {
  transformKeyTextField,
  transformRichTextField,
  transformRichTextFieldToString,
} from '.';

type Agent = WithContributors['contributors'][number]['contributor'];

export function transformContributorAgent(
  agent: Agent
): Contributor['contributor'] | undefined {
  if (isFilledLinkToDocumentWithData(agent)) {
    const commonFields = {
      id: agent.id,
      description: transformRichTextField(agent.data.description),
      image: agent.data.image,
      sameAs: (agent.data.sameAs ?? [])
        .map(sameAs => {
          const link = transformKeyTextField(sameAs.link);
          const title = prismicH.asText(sameAs.title);
          return title && link ? { title, link } : undefined;
        })
        .filter(isNotUndefined),
    };

    const name =
      typeof agent.data.name === 'string'
        ? transformKeyTextField(agent.data.name)
        : Array.isArray(agent.data.name)
        ? transformRichTextFieldToString(agent.data.name)
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
        pronouns: transformKeyTextField(agent.data.pronouns as KeyTextField),
      };
    }
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
            title: transformRichTextFieldToString(roleDocument.data.title),
            describedBy: transformKeyTextField(roleDocument.data.describedBy),
          }
        : undefined;

      const description = transformRichTextField(contributor.description);

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
