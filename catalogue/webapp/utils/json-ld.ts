import { Work as WorkType } from '@weco/catalogue/services/wellcome/catalogue/types';
import { objToJsonLd } from '@weco/common/utils/json-ld';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';

export function workLd(work: WorkType): JsonLdObj {
  const creators = (work.contributors || []).map(c => {
    return {
      '@type': c.agent.type,
      name: c.agent.label,
    };
  });

  const keywords = work.subjects.map(s => s.label).join(',');

  return objToJsonLd(
    {
      additionalType: undefined, // TODO: needs API
      locationCreated: undefined, // TODO: needs API
      genre: undefined, // TODO: needs API
      datePublished: undefined, // TODO: needs API
      dateCreated: undefined, // TODO: needs API
      dateModified: undefined, // TODO: needs API
      alternativeHeadline: undefined, // TODO: needs API
      publishedBy: undefined, // TODO: needs API
      creator: creators,
      keywords,
      name: work.title,
      description: work.description,

      thumbnailUrl: work?.thumbnail?.url,
      license: work?.thumbnail?.license?.url,
    },
    { type: 'CreativeWork' }
  );
}
