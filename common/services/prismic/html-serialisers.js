// @flow
import PrismicDOM from 'prismic-dom';
import linkResolver from './link-resolver';
const {Elements} = PrismicDOM.RichText;

type HtmlSeriliser = (
  type: string,
  element: string,
  content: string,
  children: string[]
) => string

export const dropCapSerialiser: HtmlSeriliser = (
  type,
  element,
  content,
  children
) => {
  return defaultSerializer(type, element, content, children);
};

const defaultSerializer: HtmlSeriliser = (type, element, content, children) => {
  switch (type) {
    case Elements.heading1: return `<h1>${children.join('')}</h1>`;
    case Elements.heading2: return `<h2>${children.join('')}</h2>`;
    case Elements.heading3: return `<h3>${children.join('')}</h3>`;
    case Elements.heading4: return `<h4>${children.join('')}</h4>`;
    case Elements.heading5: return `<h5>${children.join('')}</h5>`;
    case Elements.heading6: return `<h6>${children.join('')}</h6>`;
    case Elements.paragraph: return `<p>${children.join('')}</p>`;
    case Elements.preformatted: return `<pre>${children.join('')}</pre>`;
    case Elements.strong: return `<strong>${children.join('')}</strong>`;
    case Elements.em: return `<em>${children.join('')}</em>`;
    case Elements.listItem: return `<li>${children.join('')}</li>`;
    case Elements.oListItem: return `<li>${children.join('')}</li>`;
    case Elements.list: return `<ul>${children.join('')}</ul>`;
    case Elements.oList: return `<ol>${children.join('')}</ol>`;
    case Elements.image:
      const url = element.linkTo ? PrismicDOM.Link.url(element.linkTo, module.exports.linkResolver) : null;
      const linkTarget = element.linkTo && element.linkTo.target ? `target="${element.linkTo.target}" rel="noopener"` : '';
      const wrapperClassList = [element.label || '', 'block-img'];
      const img = `<img src="${element.url}" alt="${element.alt || ''}" copyright="${element.copyright || ''}">`;
      return (`
        <p class="${wrapperClassList.join(' ')}">
          ${url ? `<a ${linkTarget} href="${url}">${img}</a>` : img}
        </p>
      `);
    case Elements.embed:
      return (`
        <div data-oembed="${element.oembed.embed_url}"
          data-oembed-type="${element.oembed.type}"
          data-oembed-provider="${element.oembed.provider_name}"
        >
          ${element.oembed.html}
        </div>
      `);
    case Elements.hyperlink:
      const target = element.data.target ? `target="${element.data.target}" rel="noopener"` : '';
      const linkUrl = PrismicDOM.Link.url(element.data, linkResolver);
      return `<a ${target} href="${linkUrl}">${children.join('')}</a>`;
    case Elements.label:
      const label = element.data.label ? ` class="${element.data.label}"` : '';
      return `<span ${label}>${children.join('')}</span>`;
    case Elements.span: return content ? content.replace(/\n/g, '<br />') : '';
    default: return null;
  }
};
