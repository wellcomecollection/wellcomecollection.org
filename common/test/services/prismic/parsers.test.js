// @flow
import {parseSameAs} from '../../../services/prismic/parsers';

export const sameAs = [
  { link: 'https://twitter.com/mbannisy', title: [] },
  { link: 'http://things.com', title: [] },
  { link: 'https://google.com',
    title: [ { type: 'heading1', text: 'This is it!', spans: [] } ] }
];
it('should parse same as correctly', () => {
  const [twitter, url, urlWithTitleOverride] = parseSameAs(sameAs);

  expect(twitter).toEqual({ link: 'https://twitter.com/mbannisy', title: '@mbannisy' });
  expect(url).toEqual({ link: 'http://things.com', title: 'things.com' });
  expect(urlWithTitleOverride).toEqual({ link: 'https://google.com', title: 'This is it!' });
});
