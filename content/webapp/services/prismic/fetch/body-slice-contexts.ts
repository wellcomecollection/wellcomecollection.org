import {
  ArchiveCardListSlice,
  PagesDocumentDataBodySlice,
} from '@weco/common/prismicio-types';
import { getArchiveWorks } from '@weco/content/services/wellcome/catalogue/works';
import { BodySliceContexts } from '@weco/content/views/components/Body';
import { Toggles } from '@weco/toggles';

export async function getBodySliceContexts(
  bodySlices: PagesDocumentDataBodySlice[],
  toggles: Toggles
): Promise<BodySliceContexts> {
  const archiveCardIds = bodySlices
    .filter(
      (slice): slice is ArchiveCardListSlice =>
        slice.slice_type === 'archiveCardList'
    )
    .flatMap(slice => slice.primary.items)
    .map(item => item.id)
    .filter((id): id is string => !!id);

  const archiveWorks =
    archiveCardIds.length > 0
      ? await getArchiveWorks(archiveCardIds, toggles)
      : {};

  return { archiveWorks };
}
