// @flow
import TestRenderer from 'react-test-renderer';
import {getWork} from '../services/catalogue/works';
import {WorkPage} from '../pages/work';

it('renders <WorkPage /> with an catalogue API work response', async () => {
  const work = await getWork('a3gvp92j');
  // TODO: Work with Next.js dynamic(import(...))
  const WorkPageComponent = TestRenderer.create(
    <WorkPage work={work} page={null} previousQueryString={null} />
  );
  expect(WorkPageComponent).not.toBe(null);
});
