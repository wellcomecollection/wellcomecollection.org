// @flow
import PrismicDOM from 'prismic-dom';
import linkResolver from './link-resolver';

const { Elements } = PrismicDOM.RichText;

export type HtmlSerializer = (
  type: string,
  element: Object, // There are so many types here
  content: string,
  children: string[],
  i: number
) => ?any;

export const dropCapSerializer: HtmlSerializer = (
  type,
  element,
  content,
  children,
  i
) => {
  if (type === Elements.paragraph && i === 0) {
    const firstCharacters = children[0];

    if (typeof firstCharacters !== 'string') {
      return <p>{children}</p>;
    }

    const firstLetter = firstCharacters.charAt(0);
    const cappedFirstLetter = <span className="drop-cap">{firstLetter}</span>;
    const newfirstCharacters = [cappedFirstLetter, firstCharacters.slice(1)];
    const childrenWithDropCap = [newfirstCharacters, ...children.slice(1)];

    return <p>{childrenWithDropCap}</p>;
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
      return <h1>{children}</h1>;
    case Elements.heading2:
      return <h2>{children}</h2>;
    case Elements.heading3:
      return <h3>{children}</h3>;
    case Elements.heading4:
      return <h4>{children}</h4>;
    case Elements.heading5:
      return <h5>{children}</h5>;
    case Elements.heading6:
      return <h6>{children}</h6>;
    case Elements.paragraph:
      return <p>{children}</p>;
    case Elements.preformatted:
      return <pre>{children}</pre>;
    case Elements.strong:
      return <strong>{children}</strong>;
    case Elements.em:
      return <em>{children}</em>;
    case Elements.listItem:
      return <li>{children}</li>;
    case Elements.oListItem:
      return <li>{children}</li>;
    case Elements.list:
      return <ul>{children}</ul>;
    case Elements.oList:
      return <ol>{children}</ol>;
    case Elements.image:
      const url = element.linkTo
        ? PrismicDOM.Link.url(element.linkTo, linkResolver)
        : null;
      const linkTarget =
        element.linkTo && element.linkTo.target
          ? element.linkTo.target
          : undefined;
      const linkRel = linkTarget ? 'noopener' : undefined;
      const wrapperClassList = [element.label || '', 'block-img'];
      const img = (
        <img
          src={element.url}
          alt={element.alt || ''}
          copyright={element.copyright || ''}
        />
      );

      return (
        <p className={wrapperClassList.join(' ')}>
          {url ? (
            <a target={linkTarget} rel={linkRel} href={url}>
              {img}
            </a>
          ) : (
            img
          )}
        </p>
      );
    case Elements.embed:
      return (
        <div
          data-oembed={element.oembed.embed_url}
          data-oembed-type={element.oembed.type}
          data-oembed-provider={element.oembed.provider_name}
        >
          {element.oembed.html}
        </div>
      );
    case Elements.hyperlink:
      const target = element.data.target || undefined;
      const rel = target ? 'noopener' : undefined;
      const linkUrl = PrismicDOM.Link.url(element.data, linkResolver);
      const isDocument = element.data.kind === 'document';
      const documentSize = isDocument
        ? Math.round(element.data.size / 1000)
        : '';

      const isInPage = linkUrl.match(/^https:\/\/(#.*)/i);
      const hashLink = isInPage && isInPage[1];

      const fileExtension = linkUrl.match(/\.[0-9a-z]+$/i);
      const documentType =
        fileExtension && fileExtension[0].substr(1).toUpperCase();

      if (hashLink) {
        return (
          <a target={target} rel={rel} href={hashLink}>
            {children}
          </a>
        );
      }

      if (isDocument) {
        return (
          <a
            target={target}
            className="no-margin plain-link font-green font-HNM3-s flex-inline flex--h-baseline"
            href={linkUrl}
          >
            <span className="icon" style={{ top: '8px' }}>
              <canvas className="icon__canvas" height="20" width="20"></canvas>
              <svg
                className="icon__svg no-margin"
                role="img"
                aria-labelledby="icon-download-title"
                style={{ width: '20px', height: '20px' }}
              >
                <title id="icon-download-title">download</title>
                <svg viewBox="0 0 26 26">
                  <path
                    className="icon__shape"
                    d="M21.2 21.1H4.8a1 1 0 0 0 0 2h16.4a1 1 0 0 0 0-2zm-8.98-2.38a1 1 0 0 0 1.56 0l4-5a1 1 0 0 0-1.56-1.25L14 15.25V4.1a1 1 0 0 0-2 0v11.15l-2.22-2.78a1 1 0 1 0-1.56 1.25z"
                  />
                </svg>
              </svg>
            </span>
            <span className="no-margin">
              <span className="no-margin underline-on-hover">{children}</span>
              <span style={{ whiteSpace: 'nowrap' }}>
                <span className="no-margin font-pewter font-HNM4-s">
                  {documentType}
                </span>
                <span className="no-margin font-pewter font-HNL4-s">
                  {documentSize}kb
                </span>
              </span>
            </span>
          </a>
        );
      } else {
        return (
          <a target={target} href={linkUrl}>
            {children}
          </a>
        );
      }
    case Elements.label:
      const labelClass = element.data.label || undefined;
      return <span className={labelClass}>{children}</span>;
    case Elements.span:
      return content ? content.replace(/\n/g, '<br />') : '';
    default:
      return null;
  }
};
