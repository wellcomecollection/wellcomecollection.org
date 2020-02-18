describe('logged out', () => {
  beforeAll(async () => {
    await page.setCookie({
      name: 'toggle_stacksRequestService',
      value: 'true',
      domain: 'localhost',
      path: '/',
    });
    await page.goto('http://localhost:3000/works/h6tcdtrt');
  });

  it('contains a login link', async () => {
    const cognitoUrl = 'https://id.wellcomecollection.org/oauth2';

    const anchors = await page.$$('a');
    const jsHandles = await Promise.all(
      anchors.map(anchor => anchor.getProperty('href'))
    );

    const hrefs = await Promise.all(
      jsHandles.map(handle => handle.jsonValue())
    );

    const loginUrls = hrefs.filter(href => href.match(cognitoUrl));

    await expect(loginUrls.length).toEqual(1);
  });
});
