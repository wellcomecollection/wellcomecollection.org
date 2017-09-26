import getLicenseInfo from './get-license-info';

function getTitleHtml(title, author, sourceLink) {
  if (!title) return '';

  const byAuthor = author ? `, by ${author.trim()}` : '';

  if (sourceLink) {
    return `<a href="${sourceLink.trim()}" property="dc:title" rel="cc:attributionURL">${title.trim()}${byAuthor}</a>. `;
  } else {
    return `<span property="dc:title">${title.trim()}${byAuthor}.</span> `;
  }
}

function getSourceHtml(sourceName, sourceLink) {
  if (!sourceName) return '';

  if (sourceLink) {
    return `Source: <a href="${sourceLink.trim()}" rel="cc:attributionURL">${sourceName.trim()}</a>. `;
  } else {
    return `Source: ${sourceName.trim()}. `;
  }
}

function getCopyrightHtml(copyrightHolder, copyrightLink) {
  if (!copyrightHolder) return '';

  if (copyrightLink) {
    return `&copy; <a href="${copyrightLink.trim()}">${copyrightHolder.trim()}</a>. `;
  } else {
    return `&copy; ${copyrightHolder.trim()}. `;
  }
}

export default function({title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink}) {
  const titleHtml = getTitleHtml(title, author, sourceLink);
  const sourceHtml = getSourceHtml(sourceName, sourceLink);
  const licenseInfo = license && getLicenseInfo(license.trim());
  const copyrightHtml = getCopyrightHtml(copyrightHolder, copyrightLink);
  const licenseHtml = licenseInfo ? `<a rel="license" href="${licenseInfo.url}">${licenseInfo.text}</a>.` : '';

  return `${titleHtml}${sourceHtml}${copyrightHtml}${licenseHtml}`;
}
