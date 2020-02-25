// @flow
import ItemRequestButton from '@weco/catalogue/components/ItemRequestButton/ItemRequestButton';
import {
  mountWithTheme,
  updateWrapperAsync,
} from '@weco/common/test/fixtures/enzyme-helpers';
// import mockAuthData from '@weco/common/hooks/useAuth'; // TODO
// const authorized = mockAuthData.authorized;
// jest.mock('@weco/common/hooks/useAuth', () => {
//   return async () =>
//     new Promise((resolve, reject) => {
//       resolve(JSON.stringify({ type: 'unauthorized', token: '123' }));
//     });
// });

const item = {
  id: 'sbumwwzs',
  location: { id: 'sgpbi', label: 'Closed stores Biog. pam' },
  status: { id: 'available', label: 'Available' },
};
const workId = '123';

describe('ItemRequestButton', () => {
  it('Renders the login button', async () => {
    const component = mountWithTheme(
      <ItemRequestButton item={item} workId={workId} />
    );
    await updateWrapperAsync(component);
    console.log('Button Text', component.text());
    expect(component.find("[data-test-id='libraryLogin']").text());
    // text
  });
});
// 'Login to request and view in the library'
