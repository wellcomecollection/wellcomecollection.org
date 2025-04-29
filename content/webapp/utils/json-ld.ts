import { objToJsonLd } from '@weco/common/utils/json-ld';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import { Work as WorkType } from '@weco/content/services/wellcome/catalogue/types';

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
