import getLicenseInfo from './get-license-info';

function setTitle(title, author, sourceLink) {
  if (!title) return '';

  const byAuthor = author ? `, by ${author}` : '';

  if (sourceLink) {
    return `<a href="${sourceLink}" property="dc:title" rel="cc:attributionURL">${title}${byAuthor}</a>. `;
  } else {
    return `<span property="dc:title">${title}${byAuthor}.</span> `;
  }
}

function setSource(sourceName, sourceLink) {
  if (!sourceName) return '';

  if (sourceLink) {
    return `Source: <a href="${sourceLink}" rel="cc:attributionURL">${sourceName}</a>. `;
  } else {
    return `Source: ${sourceName}. `;
  }
}

function setCopyright(copyrightHolder, copyrightLink) {
  if (!copyrightHolder) return '';

  if (copyrightLink) {
    return `Copyright: <a href="${copyrightLink}">${copyrightHolder}</a>. `;
  } else {
    return `Copyright: ${copyrightHolder}. `;
  }
}

export default function({title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink}) {
  const titleMarkup = setTitle(title, author, sourceLink);
  const sourceMarkup = setSource(sourceName, sourceLink);
  const licenseInfo = license && getLicenseInfo(license);
  const copyrightMarkup = setCopyright(copyrightHolder, copyrightLink);
  const licenseMarkup = licenseInfo ? `<a rel="license" href="${licenseInfo.url}">${licenseInfo.text}</a>.` : '';

  return `${titleMarkup}${sourceMarkup}${copyrightMarkup}${licenseMarkup}`;
}
