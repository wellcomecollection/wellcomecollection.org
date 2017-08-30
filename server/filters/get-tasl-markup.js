import getLicenseInfo from './get-license-info';

function getTitleHtml(title, author, sourceLink) {
  if (!title) return '';

  const byAuthor = author ? `, by ${author}` : '';

  if (sourceLink) {
    return `<a href="${sourceLink}" property="dc:title" rel="cc:attributionURL">${title}${byAuthor}</a>. `;
  } else {
    return `<span property="dc:title">${title}${byAuthor}.</span> `;
  }
}

function getSourceHtml(sourceName, sourceLink) {
  if (!sourceName) return '';

  if (sourceLink) {
    return `Source: <a href="${sourceLink}" rel="cc:attributionURL">${sourceName}</a>. `;
  } else {
    return `Source: ${sourceName}. `;
  }
}

function getCopyrightHtml(copyrightHolder, copyrightLink) {
  if (!copyrightHolder) return '';

  if (copyrightLink) {
    return `&copy; <a href="${copyrightLink}">${copyrightHolder}</a>. `;
  } else {
    return `&copy; ${copyrightHolder}. `;
  }
}

export default function({title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink}) {
  const titleHtml = getTitleHtml(title, author, sourceLink);
  const sourceHtml = getSourceHtml(sourceName, sourceLink);
  const licenseInfo = license && getLicenseInfo(license);
  const copyrightHtml = getCopyrightHtml(copyrightHolder, copyrightLink);
  const licenseHtml = licenseInfo ? `<a rel="license" href="${licenseInfo.url}">${licenseInfo.text}</a>.` : '';

  return `${titleHtml}${sourceHtml}${copyrightHtml}${licenseHtml}`;
}
