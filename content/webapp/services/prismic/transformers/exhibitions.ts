import { parseExhibitionDoc } from '@weco/common/services/prismic/exhibitions';
import { Exhibition as DeprecatedExhibition } from '@weco/common/model/exhibitions';
import { Exhibition } from '../../../types/exhibitions';
import { ExhibitionPrismicDocument } from '../types/exhibitions';
import { Query } from '@prismicio/types';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { transformQuery } from './paginated-results';
import { london } from '@weco/common/utils/format-date';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformExhibition(
  document: ExhibitionPrismicDocument
): Exhibition {
  const exhibition: DeprecatedExhibition = parseExhibitionDoc(document);

  return {
    ...exhibition,
    prismicDocument: document,
  };
}

export function transformExhibitionsQuery(
  query: Query<ExhibitionPrismicDocument>
): PaginatedResults<Exhibition> {
  const paginatedResult = transformQuery(query, transformExhibition);

  return {
    ...paginatedResult,
    results: putPermanentAfterCurrentExhibitions(paginatedResult.results),
  };
}

function putPermanentAfterCurrentExhibitions(
  exhibitions: Exhibition[]
): Exhibition[] {
  // We order the list this way as, from a user's perspective, seeing the
  // temporary exhibitions is more urgent, so they're at the front of the list,
  // but there's no good way to express that ordering through Prismic's ordering
  const groupedResults = exhibitions.reduce(
    (acc, result) => {
      // Wishing there was `groupBy`.
      if (result.isPermanent) {
        acc.permanent.push(result);
      } else if (london(result.start).isAfter(london())) {
        acc.comingUp.push(result);
      } else if (result.end && london(result.end).isBefore(london())) {
        acc.past.push(result);
      } else {
        acc.current.push(result);
      }

      return acc;
    },
    {
      current: [] as Exhibition[],
      permanent: [] as Exhibition[],
      comingUp: [] as Exhibition[],
      past: [] as Exhibition[],
    }
  );

  return [
    ...groupedResults.current,
    ...groupedResults.permanent,
    ...groupedResults.comingUp,
    ...groupedResults.past,
  ];
}
