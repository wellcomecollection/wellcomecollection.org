import linkResolver from '@weco/common/services/prismic/link-resolver';
import { dasherize } from '@weco/common/utils/grammar';
import { JSXFunctionSerializer } from '@prismicio/react';
import { Fragment } from 'react';
import { RichTextNodeType } from '@prismicio/types';
import * as prismicH from '@prismicio/helpers';

export const defaultSerializer: JSXFunctionSerializer = (
  type,
  element,
  content,
  children,
  key
) => {
  switch (element.type) {
    case RichTextNodeType.heading1:
      return <h1 key={key}>{children}</h1>;
    case RichTextNodeType.heading2:
      return (
        <h2 key={key} id={dasherize(element.text)}>
          {children}
        </h2>
      );
    case RichTextNodeType.heading3:
      return (
        <h3 key={key} id={dasherize(element.text)}>
          {children}
        </h3>
      );
    case RichTextNodeType.heading4:
      return <h4 key={key}>{children}</h4>;
    case RichTextNodeType.heading5:
      return <h5 key={key}>{children}</h5>;
    case RichTextNodeType.heading6:
      return <h6 key={key}>{children}</h6>;
    case RichTextNodeType.paragraph:
      return <p key={key}>{children}</p>;
    case RichTextNodeType.preformatted:
      return <pre key={key}>{children}</pre>;
    case RichTextNodeType.strong:
      return <strong key={key}>{children}</strong>;
    case RichTextNodeType.em:
      return <em key={key}>{children}</em>;
    case RichTextNodeType.listItem:
      return <li key={key}>{children}</li>;
    case RichTextNodeType.oListItem:
      return <li key={key}>{children}</li>;
    case RichTextNodeType.list:
      return <ul key={key}>{children}</ul>;
    case RichTextNodeType.oList:
      return <ol key={key}>{children}</ol>;
    case RichTextNodeType.image:
      const url = element.linkTo
        ? prismicH.asLink(element.linkTo, linkResolver)
        : null;
      const linkTarget =
        element.linkTo && 'target' in element.linkTo
          ? element.linkTo.target
          : undefined;
      const linkRel = linkTarget ? 'noopener' : undefined;
      const wrapperClassList = ['block-img'];
      const img = <img src={element.url} alt={element.alt || ''} />;

      return (
        <p key={key} className={wrapperClassList.join(' ')}>
          {url ? (
            <a target={linkTarget} rel={linkRel} href={url}>
              {img}
            </a>
          ) : (
            img
          )}
        </p>
      );
    case RichTextNodeType.embed:
      return (
        <div
          key={key}
          data-oembed={element.oembed.embed_url}
          data-oembed-type={element.oembed.type}
          data-oembed-provider={element.oembed.provider_name}
        >
          {element.oembed.html}
        </div>
      );
    case RichTextNodeType.hyperlink:
      const target =
        'target' in element.data ? element.data.target || undefined : undefined;
      const rel = target ? 'noopener' : undefined;
      const linkUrl = prismicH.asLink(element.data, linkResolver)!;
      const isDocument =
        'kind' in element.data ? element.data.kind === 'document' : false;
      const nameWithoutSpaces =
        'name' in element.data && element.data.name
          ? dasherize(element.data.name)
          : '';
      const documentSize =
        isDocument && 'size' in element.data
          ? Math.round(parseInt(element.data.size) / 1000)
          : '';

      const isInPage = linkUrl.match(/^https:\/\/(#.*)/i);
      const hashLink = isInPage && isInPage[1];

      const fileExtension = linkUrl.match(/\.[0-9a-z]+$/i);
      const documentType =
        fileExtension && fileExtension[0].substring(1).toUpperCase();

      if (hashLink) {
        return (
          <a key={key} target={target} rel={rel} href={hashLink}>
            {children}
          </a>
        );
      }

      if (isDocument) {
        return (
          <a
            key={key}
            target={target}
            className="no-margin plain-link flex-inline flex--h-baseline"
            href={linkUrl}
          >
            <span
              style={{
                top: '8px',
                display: 'inline-block',
                height: '24px',
                width: '24px',
                position: 'relative',
                userSelect: 'none',
              }}
            >
              <canvas
                height="20"
                width="20"
                style={{
                  display: 'block',
                  height: '100%',
                  visibility: 'hidden',
                }}
              ></canvas>
              <svg
                className="icon__svg no-margin"
                role="img"
                aria-labelledby={`icon-download-title-${nameWithoutSpaces}`}
                fill="currentColor"
                style={{
                  width: '20px',
                  height: '20px',
                  left: '0',
                  position: 'absolute',
                  top: '0',
                }}
              >
                <title id={`icon-download-title-${nameWithoutSpaces}`}>
                  download
                </title>
                <svg viewBox="0 0 26 26">
                  <path
                    className="icon__shape"
                    d="M21.2 21.1H4.8a1 1 0 0 0 0 2h16.4a1 1 0 0 0 0-2zm-8.98-2.38a1 1 0 0 0 1.56 0l4-5a1 1 0 0 0-1.56-1.25L14 15.25V4.1a1 1 0 0 0-2 0v11.15l-2.22-2.78a1 1 0 1 0-1.56 1.25z"
                  />
                </svg>
              </svg>
            </span>
            <span className="no-margin">
              <span className="no-margin">{children}</span>{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span className="no-margin font-pewter">({documentType}</span>{' '}
                <span className="no-margin font-pewter">{documentSize}kb)</span>
              </span>
            </span>
          </a>
        );
      } else {
        return (
          <a key={key} target={target} href={linkUrl}>
            {children}
          </a>
        );
      }
    case RichTextNodeType.label:
      const labelClass = element.data.label || undefined;
      return (
        <span key={key} className={labelClass}>
          {children}
        </span>
      );
    case RichTextNodeType.span:
      return content ? (
        <Fragment key={key}>
          {content
            ? content.split('\n').reduce((acc, p) => {
                if (acc.length === 0) {
                  return [p];
                } else {
                  const brIndex = (acc.length + 1) / 2 - 1;
                  const br = <br key={brIndex} />;
                  return [...acc, br, p];
                }
              }, [])
            : null}
        </Fragment>
      ) : null;
    default:
      return null;
  }
};

export const dropCapSerializer: JSXFunctionSerializer = (
  type,
  element,
  content,
  children,
  key
) => {
  if (type === RichTextNodeType.paragraph && children[0] !== undefined) {
    const firstChild = children[0];
    const firstCharacters =
      firstChild.props &&
      firstChild.props.children &&
      firstChild.props.children[0];

    if (typeof firstCharacters !== 'string') {
      return <p key={key}>{children}</p>;
    }

    const firstLetter = firstCharacters.charAt(0);
    const cappedFirstLetter = (
      <span key={key} className="drop-cap">
        {firstLetter}
      </span>
    );
    const newfirstCharacters = [cappedFirstLetter, firstCharacters.slice(1)];
    const childrenWithDropCap = [newfirstCharacters, ...children.slice(1)];

    return <p key={key}>{childrenWithDropCap}</p>;
  }
  return defaultSerializer(type, element, content, children, key);
};
