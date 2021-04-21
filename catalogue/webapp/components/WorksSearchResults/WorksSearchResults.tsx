import { FunctionComponent } from 'react';
import { trackSearchResultSelected } from '@weco/common/views/components/Tracker/Tracker';
import WorksSearchResult from '../WorksSearchResult/WorksSearchResult';
import { grid } from '@weco/common/utils/classnames';
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';
import { CatalogueWorksApiProps } from '@weco/common/services/catalogue/ts_api';

type Props = {
  works: CatalogueResultsList<Work>;
  apiProps: CatalogueWorksApiProps;
};

const WorkSearchResults: FunctionComponent<Props> = ({
  works,
  apiProps,
}: Props) => {
  return (
    <ul className={'grid plain-list no-padding no-margin'}>
      {works.results.map((result, i) => (
        <li key={result.id} className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
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
        </li>
      ))}
    </ul>
  );
};

export default WorkSearchResults;
