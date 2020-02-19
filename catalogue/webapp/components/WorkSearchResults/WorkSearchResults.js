// @flow

import { useContext } from 'react';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import RelevanceRater from '@weco/common/views/components/RelevanceRater/RelevanceRater';
import { trackSearchResultSelected } from '@weco/common/views/components/Tracker/Tracker';
import WorkCard from '../WorkCard/WorkCard';
import { grid } from '@weco/common/utils/classnames';
import { type CatalogueResultsList } from '@weco/common/model/catalogue';
import { type CatalogueApiProps } from '@weco/common/services/catalogue/api';
import { type WorksRouteProps } from '@weco/common/services/catalogue/routes';

type Props = {|
  works: CatalogueResultsList,
  worksRouteProps: WorksRouteProps,
  apiProps: CatalogueApiProps,
|};

const WorkSearchResults = ({ works, worksRouteProps, apiProps }: Props) => {
  const { query, workType, page } = worksRouteProps;
  const { relevanceRating } = useContext(TogglesContext);

  return (
    <div className={'grid'}>
      {works.results.map((result, i) => (
        <div key={result.id} className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
          <div
            onClick={() => {
              trackSearchResultSelected(apiProps, {
                id: result.id,
                position: i,
                resultWorkType: result.workType.label,
                resultLanguage: result.language && result.language.label,
                resultIdentifiers: result.identifiers.map(
                  identifier => identifier.value
                ),
                resultSubjects: result.subjects.map(subject => subject.label),
              });
            }}
          >
            <WorkCard work={result} />
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
