const cognitoUrl = 'https://id.wellcomecollection.org/oauth2';

describe('logged out', () => {
  beforeAll(async () => {
    await page.setCookie({
      name: 'toggle_stacksRequestService',
      value: 'true',
      domain: 'localhost',
      path: '/',
    });
    await page.goto('http://localhost:3000/works/h6tcdtrt');
    await page.waitFor(`a[href^="${cognitoUrl}"]`);
  });

  it('contains a login link', async () => {
    const loginLink = await page.$(`a[href^="${cognitoUrl}"]`);
    const linkText = await page.evaluate(link => link.innerHTML, loginLink);

    await expect(linkText).toBe('Login to request and view in the library');
  });
});
