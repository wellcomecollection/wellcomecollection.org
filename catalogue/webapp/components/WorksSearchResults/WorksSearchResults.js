// @flow

import { useContext } from 'react';
// $FlowFixMe (tsx)
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import RelevanceRater from '@weco/common/views/components/RelevanceRater/RelevanceRater';
import { trackSearchResultSelected } from '@weco/common/views/components/Tracker/Tracker';
// $FlowFixMe (tsx)
import WorksSearchResult from '../WorksSearchResult/WorksSearchResult';
import { grid } from '@weco/common/utils/classnames';
import {
  type CatalogueResultsList,
  type Work,
} from '@weco/common/model/catalogue';
import { type CatalogueWorksApiProps } from '@weco/common/services/catalogue/api';
import { type WorksRouteProps } from '@weco/common/services/catalogue/routes';

type Props = {|
  works: CatalogueResultsList<Work>,
  worksRouteProps: WorksRouteProps,
  apiProps: CatalogueWorksApiProps,
|};

const WorkSearchResults = ({ works, worksRouteProps, apiProps }: Props) => {
  const { query, workType, page } = worksRouteProps;
  const { relevanceRating } = useContext(TogglesContext);

  return (
    <div className={'grid'} role="search results list">
      {works.results.map((result, i) => (
        <div key={result.id} className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
          <div
            onClick={() => {
              trackSearchResultSelected(apiProps, {
                id: result.id,
                position: i,
                resultWorkType: result.workType.label,
                resultIdentifiers: result.identifiers.map(
                  identifier => identifier.value
                ),
                resultSubjects: result.subjects.map(subject => subject.label),
                source: 'work_result',
              });
            }}
          >
            <WorksSearchResult work={result} />
          </div>

          {relevanceRating && (
            <RelevanceRater
              id={result.id}
              position={i}
              query={query}
              page={page}
              workType={workType}
              apiProps={apiProps}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkSearchResults;
