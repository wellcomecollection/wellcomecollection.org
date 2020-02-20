describe('/works', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    await page.goto('http://localhost:3001/works');
  });

  it('has the correct title', async () => {
    await expect(page.title()).resolves.toMatch(
      'Catalogue search | Wellcome Collection'
    );
  });

  it('includes the search query in the title', async () => {
    await page.type('.search-query', 'test');
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
    await expect(page.title()).resolves.toMatch(
      'test | Catalogue search | Wellcome Collection'
    );
  });
});
