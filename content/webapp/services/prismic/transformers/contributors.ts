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

export function transformContributorAgent(
  agent: WithContributors['contributors'][number]['contributor']
): Contributor['contributor'] | undefined {
  if (isFilledLinkToDocumentWithData(agent)) {
    const commonFields = {
      id: agent.id,
      name: agent.data.name ?? undefined,
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

    if (agent.type === 'organisations') {
      return {
        type: agent.type,
        ...commonFields,
      };
    } else if (agent.type === 'people') {
      return {
        type: agent.type,
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
