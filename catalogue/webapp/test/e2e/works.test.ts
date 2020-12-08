describe('works', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/works');
  });

  test('Submits the form correctly', async () => {
    await page.fill('#works-search-input', 'heArTs');
    await page.press('#works-search-input', 'Enter');
    const value = await page.$eval<string, HTMLInputElement>(
      '#works-search-input',
      el => el.value
    );
    await page.waitForSelector('[data-test-id="search-results"]');
    const searchResultsVisible = await page.$eval<boolean, HTMLDivElement>(
      '[data-test-id="search-results"]',
      () => true
    );

    expect(searchResultsVisible).toBe(true);
    expect(value).toBe('heArTs');
  });
});

export {};
