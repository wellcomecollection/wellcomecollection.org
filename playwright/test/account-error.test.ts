import { accountError } from './contexts';

test('displays the error description from the URL', async () => {
  accountError();
  await page.waitForSelector(`:has-text("Uh-oh spaghetti-O's!")`);
  const contactLink = await page.waitForSelector(
    `a[href="mailto:library@wellcomecollection.org"]`
  );
  const contactLinkText = await contactLink.innerHTML();
  expect(contactLinkText).toContain('Contact us');
});
