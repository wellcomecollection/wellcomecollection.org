// @flow
import {getWorks, getWork} from '../../../services/catalogue/works';

it('/works', async () => {
  const works = await getWorks({query: 'botany', page: 1});
  expect(works).toMatchSnapshot();
});

it('/work/:id', async () => {
  const work = await getWork({ id: 'a3gvp92j' });
  expect(work).toMatchSnapshot();
});
