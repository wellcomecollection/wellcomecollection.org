import works from '@weco/catalogue/__mocks__/catalogue-work';

describe('/works', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    await page.setRequestInterception(true);

    page.on('request', request => {
      if (
        request
          .url()
          .startsWith('https://api.wellcomecollection.org/catalogue/')
      ) {
        request.respond({
          content: 'application/json',
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(works),
        });
      } else {
        request.continue();
      }
    });

    await page.goto('http://localhost:3001/works');
  });

  it('has the correct title', async () => {
    await expect(page.title()).resolves.toMatch(
      'Catalogue search | Wellcome Collection'
    );
  });

  it('renders search results', async () => {
    await page.type('.search-query', 'test');
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    await expect(page.title()).resolves.toMatch(
      'test | Catalogue search | Wellcome Collection'
    );

    const element = await page.$('.main h2');
    const textContent = await element.getProperty('textContent');
    const value = await textContent.jsonValue();

    await expect(value).toBe(
      'Test type apparatus for the detection of malingerers, France'
    );
  });
});
