import { Work } from '@weco/common/model/catalogue';
import { getArchiveLabels, getProductionDates } from 'utils/works';
import { WorkBasic } from '@weco/common/services/catalogue/types/works';

export function transformWorkToWorkBasic(work: Work): WorkBasic {
  const archiveLabels = getArchiveLabels(work);

  return {
    id: work.id,
    title: work.title,
    reference: archiveLabels?.reference,
    productionDates: getProductionDates(work),
    thumbnailUrl: work.thumbnail?.url,
    partOf: archiveLabels?.partOf,
    workType: { label: work.workType.label },
    availabilities: (work.availabilities || []).map(({ id }) => ({ id })),
    primaryContributors: work.contributors
      .filter(c => c.primary === true)
      .map(({ agent }) => ({ label: agent.label })),
  };
}
