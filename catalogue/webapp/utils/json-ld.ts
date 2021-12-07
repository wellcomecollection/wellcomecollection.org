import { Work as WorkType } from '@weco/common/model/catalogue';
import { objToJsonLd } from '@weco/common/utils/json-ld';

export function workLd(work: WorkType) {
  const creators = (work.contributors || []).map(c => {
    return {
      '@type': c.agent.type,
      name: c.agent.label,
    };
  });

  const keywords = work.subjects.map(s => s.label).join(',');

  return objToJsonLd(
    {
      additionalType: null, // TODO: needs API
      locationCreated: null, // TODO: needs API
      genre: null, // TODO: needs API
      datePublished: null, // TODO: needs API
      dateCreated: null, // TODO: needs API
      dateModified: null, // TODO: needs API
      alternativeHeadline: null, // TODO: needs API
      publishedBy: null, // TODO: needs API
      creator: creators,
      keywords: keywords,
      name: work.title,
      description: work.description,
      image: work.imgLink,
      thumbnailUrl: work?.thumbnail?.url,
      license: work?.thumbnail?.license?.url,
    },
    'CreativeWork'
  );
}
