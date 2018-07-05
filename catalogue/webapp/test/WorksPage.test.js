// @flow
import TestRenderer from 'react-test-renderer';
import {getWorks} from '../services/catalogue/works';
import {WorksPage} from '../pages/works';

it('renders <WorksPage /> with an catalogue API works response', async () => {
  const page = 2;
  const query = 'botany';
  const works = await getWorks({ query, page });
  const WorksPageComponent = TestRenderer.create(<WorksPage
    query={query}
    works={works}
    page={page}
    pagination={null}
  />);

  expect(WorksPageComponent).not.toBe(null);
});
