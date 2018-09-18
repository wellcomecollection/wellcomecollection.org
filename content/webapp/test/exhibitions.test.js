// @flow
import TestRenderer from 'react-test-renderer';
import httpMocks from 'node-mocks-http';
import {getExhibition} from '@weco/common/services/prismic/exhibitions';
import {ExhibitionPage} from '../pages/exhibition';

it('renders <ExhibitionPage /> with an exhibition from Prismic', async () => {
  const exhibition = await getExhibition(httpMocks.createRequest({
    method: 'GET',
    url: '/exhibitions/WgV_ACUAAIu2P_ZM'
  }), 'WgV_ACUAAIu2P_ZM');
  expect(exhibition).not.toBe(null);

  if (exhibition) {
    const Page = TestRenderer.create(
      <ExhibitionPage exhibition={exhibition} />
    );
    expect(Page).not.toBe(null);
  }
});
