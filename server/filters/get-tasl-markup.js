import getLicenseInfo from './get-license-info';

export default function({title, author, source, license}) {
  const titleMarkup = source ? `<a rel="cc:attributionURL" property="dc:title" href="${source}">${title || source}</a>. ` : `<span property="dc:title">${title}.</span> `;
  const authorMarkup = author ? `Credit: <span property="cc:attributionName">${author}.</span> ` : '';
  const licenseInfo = license && getLicenseInfo(license);
  const licenseMarkup = licenseInfo ? `<a rel="license" href="${licenseInfo.url}">${licenseInfo.text}</a>.` : '';

  return `${titleMarkup}${authorMarkup}${licenseMarkup}`;
}
