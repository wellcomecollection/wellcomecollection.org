// @flow
import PrismicDOM from 'prismic-dom';
import linkResolver from './link-resolver';
import { font } from '../../utils/classnames';

const { Elements } = PrismicDOM.RichText;

export type HtmlSerializer = (
  type: string,
  element: Object, // There are so many types here
  content: string,
  children: string[],
  i: number
) => ?string;

export const dropCapSerializer: HtmlSerializer = (
  type,
  element,
  content,
  children,
  i
) => {
  if (type === Elements.paragraph && i === 0) {
    const firstLetter = children[0].charAt(0);
    const restOfLetters = [...children[0].substr(1), ...children.slice(1)];

    return `<p><span class="drop-cap ${font({
      s: 'WB3',
      m: 'WB2',
    })}">${firstLetter}</span>${restOfLetters.join('')}</p>`;
  }
  return defaultSerializer(type, element, content, children, i);
};

export const defaultSerializer: HtmlSerializer = (
  type,
  element,
  content,
  children,
  i
) => {
  switch (type) {
    case Elements.heading1:
      return `<h1>${children.join('')}</h1>`;
    case Elements.heading2:
      return `<h2>${children.join('')}</h2>`;
    case Elements.heading3:
      return `<h3>${children.join('')}</h3>`;
    case Elements.heading4:
      return `<h4>${children.join('')}</h4>`;
    case Elements.heading5:
      return `<h5>${children.join('')}</h5>`;
    case Elements.heading6:
      return `<h6>${children.join('')}</h6>`;
    case Elements.paragraph:
      return `<p>${children.join('')}</p>`;
    case Elements.preformatted:
      return `<pre>${children.join('')}</pre>`;
    case Elements.strong:
      return `<strong>${children.join('')}</strong>`;
    case Elements.em:
      return `<em>${children.join('')}</em>`;
    case Elements.listItem:
      return `<li>${children.join('')}</li>`;
    case Elements.oListItem:
      return `<li>${children.join('')}</li>`;
    case Elements.list:
      return `<ul>${children.join('')}</ul>`;
    case Elements.oList:
      return `<ol>${children.join('')}</ol>`;
    case Elements.image:
      const url = element.linkTo
        ? PrismicDOM.Link.url(element.linkTo, module.exports.linkResolver)
        : null;
      const linkTarget =
        element.linkTo && element.linkTo.target
          ? `target="${element.linkTo.target}" rel="noopener"`
          : '';
      const wrapperClassList = [element.label || '', 'block-img'];
      const img = `<img src="${element.url}" alt="${element.alt ||
        ''}" copyright="${element.copyright || ''}">`;
      return `
        <p class="${wrapperClassList.join(' ')}">
          ${url ? `<a ${linkTarget} href="${url}">${img}</a>` : img}
        </p>
      `;
    case Elements.embed:
      return `
        <div data-oembed="${element.oembed.embed_url}"
          data-oembed-type="${element.oembed.type}"
          data-oembed-provider="${element.oembed.provider_name}"
        >
          ${element.oembed.html}
        </div>
      `;
    case Elements.hyperlink:
      const target = element.data.target
        ? `target="${element.data.target}" rel="noopener"`
        : '';
      const linkUrl = PrismicDOM.Link.url(element.data, linkResolver);
      const isDocument = element.data.kind === 'document';
      const documentSize = isDocument
        ? Math.round(element.data.size / 1000)
        : '';
      const fileExtension = linkUrl.match(/\.[0-9a-z]+$/i);
      const documentType =
        fileExtension && fileExtension[0].substr(1).toUpperCase();
      if (isDocument) {
        return `<a ${target} class="no-margin plain-link font-green font-HNM3-s flex-inline flex--h-baseline" href="${linkUrl}">
            <span class="icon" style="top: 8px">
              <canvas class="icon__canvas" height="20" width="20"></canvas>
              <svg class="icon__svg no-margin" role="img" aria-labelledby="icon-download-title" style="width: 20px; height: 20px;">
                <title id="icon-download-title">download</title>
                <svg viewBox="0 0 26 26"><path class="icon__shape" d="M21.2 21.1H4.8a1 1 0 0 0 0 2h16.4a1 1 0 0 0 0-2zm-8.98-2.38a1 1 0 0 0 1.56 0l4-5a1 1 0 0 0-1.56-1.25L14 15.25V4.1a1 1 0 0 0-2 0v11.15l-2.22-2.78a1 1 0 1 0-1.56 1.25z"/></svg>
              </svg>
            </span>
            <span class="no-margin">
              <span class="no-margin underline-on-hover">${children.join(
                ''
              )}</span>
              <span style="white-space: nowrap">
                <span class="no-margin font-pewter font-HNM4-s">${documentType}</span>
                <span class="no-margin font-pewter font-HNL4-s">${documentSize}kb</span>
              </span>
            </span>
        </a>`;
      } else {
        return `<a ${target} href="${linkUrl}">${children.join('')}</a>`;
      }
    case Elements.label:
      const label = element.data.label ? ` class="${element.data.label}"` : '';
      return `<span ${label}>${children.join('')}</span>`;
    case Elements.span:
      return content ? content.replace(/\n/g, '<br />') : '';
    default:
      return null;
  }
};
