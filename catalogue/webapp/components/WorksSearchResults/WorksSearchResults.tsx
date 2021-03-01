import { FunctionComponent, useContext } from 'react';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import RelevanceRater from '@weco/common/views/components/RelevanceRater/RelevanceRater';
import { trackSearchResultSelected } from '@weco/common/views/components/Tracker/Tracker';
import WorksSearchResult from '../WorksSearchResult/WorksSearchResult';
import { grid } from '@weco/common/utils/classnames';
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';
import { CatalogueWorksApiProps } from '@weco/common/services/catalogue/ts_api';
import { WorksProps } from '@weco/common/views/components/WorksLink/WorksLink';

type Props = {
  works: CatalogueResultsList<Work>;
  worksRouteProps: WorksProps;
  apiProps: CatalogueWorksApiProps;
};

const WorkSearchResults: FunctionComponent<Props> = ({
  works,
  worksRouteProps,
  apiProps,
}: Props) => {
  const { query, workType, page } = worksRouteProps;
  const { relevanceRating } = useContext(TogglesContext);

  return (
    <ul className={'grid plain-list no-padding no-margin'} role="list">
      {works.results.map((result, i) => (
        <li
          key={result.id}
          className={grid({ s: 12, m: 12, l: 12, xl: 12 })}
          role="listitem"
        >
          <div
            onClick={() => {
              trackSearchResultSelected(apiProps, {
                id: result.id,
                position: i,
                resultWorkType: result.workType.label,
                resultIdentifiers: result.identifiers.map(
                  identifier => identifier.value
                ),
                resultSubjects:
                  result.subjects?.map(subject => subject.label) || [],
                source: 'work_result',
              });
            }}
          >
            <WorksSearchResult work={result} resultPosition={i} />
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
        </li>
      ))}
    </ul>
  );
};

export default WorkSearchResults;
