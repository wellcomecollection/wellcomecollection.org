// @flow
import { useContext } from 'react';
import SearchContext, {
  type CatalogueQuery,
  SearchProvider,
  SearchRouter,
} from '../components/SearchContext/SearchContext';

type CheckboxesProps = {|
  options: {| id: string, label: string |}[],
  name: string,
  values: string[],
  setter: (values: string[]) => void,
|};

const Checkboxes = ({ name, options, values, setter }: CheckboxesProps) => (
  <fieldset>
    {options.map(({ id, label }) => (
      <label key={id}>
        {label}
        <input
          type="checkbox"
          name={name}
          value={id}
          checked={values.indexOf(id) !== -1}
          onChange={event =>
            setter(
              event.currentTarget.checked
                ? [id, ...values].sort()
                : values.filter(val => val !== id).sort()
            )
          }
        />
      </label>
    ))}
  </fieldset>
);

const Search = () => {
  const {
    query,
    page,
    workType,
    itemsLocationsLocationType,
    queryType,
    setQuery,
    setPage,
    setWorkType,
    setItemsLocationsLocationType,
    setQueryType,
  } = useContext(SearchContext);
  return (
    <form>
      <h1 className="h1">Component 1: sets context variables</h1>
      <label>
        Query
        <input
          type="text"
          name="query"
          value={query}
          onChange={event => setQuery(event.currentTarget.value)}
        />
      </label>

      <label>
        Page
        <input
          type="number"
          value={page}
          min={1}
          onChange={event => setPage(parseInt(event.currentTarget.value || 1))}
        />
      </label>

      <fieldset>
        <Checkboxes
          name="workType"
          values={workType}
          setter={setWorkType}
          options={[
            {
              id: 'a',
              label: 'Books',
            },
            {
              id: 'k',
              label: 'Pictures',
            },
            {
              id: 'q',
              label: 'Digital images',
            },
          ]}
        />
      </fieldset>

      <fieldset>
        <Checkboxes
          name="items.locations.locationType"
          values={itemsLocationsLocationType}
          setter={setItemsLocationsLocationType}
          options={[
            {
              id: 'iiif-image',
              label: 'IIIF Image',
            },
            {
              id: 'iiif-presentation',
              label: 'IIIF Presentation',
            },
          ]}
        />
      </fieldset>

      <fieldset>
        <label>
          Query type
          <select
            name="queryType"
            value={queryType || ''}
            onChange={event =>
              setQueryType(
                event.currentTarget.value === ''
                  ? null
                  : event.currentTarget.value
              )
            }
          >
            <option value="">None</option>
            {[
              {
                id: 'justboost',
                label: 'justboost',
              },
              {
                id: 'broaderboost',
                label: 'broaderboost',
              },
              {
                id: 'slop',
                label: 'slop',
              },
              {
                id: 'minimummatch',
                label: 'minimummatch',
              },
            ].map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </fieldset>
    </form>
  );
};

const SearchParams = () => {
  const {
    query,
    page,
    workType,
    itemsLocationsLocationType,
    queryType,
  } = useContext(SearchContext);

  return (
    <div>
      <h1 className="h1">Component 2: reads context values</h1>
      <ul>
        <li>query: {query}</li>
        <li>page: {page}</li>
        <li>workType: {workType}</li>
        <li>itemsLocationsLocationType: {itemsLocationsLocationType}</li>
        <li>queryType: {queryType}</li>
      </ul>
    </div>
  );
};

const Page = ({
  query,
  page,
  workType,
  itemsLocationsLocationType,
  queryType,
}: CatalogueQuery) => {
  return (
    <SearchProvider
      initialState={{
        query,
        page,
        workType,
        itemsLocationsLocationType,
        queryType,
      }}
    >
      <hr className="divider divider--black divider--dashed" />
      <Search />
      <hr
        style={{ marginTop: '50px' }}
        className="divider divider--black divider--dashed"
      />
      <SearchParams />
      <hr
        style={{ marginTop: '50px' }}
        className="divider divider--black divider--dashed"
      />

      <SearchRouter>
        {searchRouter => (
          <div>
            <h1 className="h1">Component 3: uses SearchRouter</h1>
            <button
              type="button"
              onClick={() => {
                searchRouter.push();
              }}
            >
              Search
            </button>
          </div>
        )}
      </SearchRouter>
    </SearchProvider>
  );
};

Page.getInitialProps = async (ctx): Promise<CatalogueQuery> => {
  const {
    query = '',
    page = 1,
    workType = ['k', 'q'],
    itemsLocationsLocationType = ['iiif-image'],
    queryType = null,
  } = ctx.query;

  return {
    query,
    page,
    workType,
    itemsLocationsLocationType,
    queryType,
  };
};

export default Page;
