import { downloadUrl } from '../../../services/catalogue/urls';

it('creates a download URL', () => {
  const result = downloadUrl({ workId: 'mm9c6ekj' });

  expect(result.href).toEqual({
    pathname: '/download',
    query: { workId: 'mm9c6ekj' },
  });
  expect(result.as).toEqual({
    pathname: '/works/mm9c6ekj/download',
    query: {},
  });
});

it('creates a download URL with a Sierra ID', () => {
  const result = downloadUrl({ workId: 'mm9c6ekj', sierraId: 'b31353319' });

  expect(result.href).toEqual({
    pathname: '/download',
    query: { workId: 'mm9c6ekj', sierraId: 'b31353319' },
  });
  expect(result.as).toEqual({
    pathname: '/works/mm9c6ekj/download',
    query: { sierraId: 'b31353319' },
  });
});
