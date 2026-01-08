// eslint-data-component: intentionally omitted
import * as prismic from '@prismicio/client';
import { JSXFunctionSerializer } from '@prismicio/react';
import { Fragment } from 'react';
import styled from 'styled-components';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { dasherize } from '@weco/common/utils/grammar';
import { getMimeTypeFromExtension } from '@weco/common/utils/mime';
import DownloadLink from '@weco/common/views/components/DownloadLink';
import FeaturedWorkLink from '@weco/common/views/components/FeaturedWorkLink';
import Icon from '@weco/common/views/components/Icon';
import {
  bslSquare,
  audioDescribed,
  accessible,
  inductionLoop,
} from '@weco/common/icons';

const DocumentType = styled.span`
  color: ${props => props.theme.color('neutral.600')};
`;

export const defaultSerializer: JSXFunctionSerializer = (
  type,
  element,
  content,
  children,
  key
) => {
  switch (element.type) {
    case prismic.RichTextNodeType.heading1:
      return <h1 key={key}>{children}</h1>;
    case prismic.RichTextNodeType.heading2:
      return (
        <h2 key={key} id={dasherize(element.text)}>
          {children}
        </h2>
      );
    case prismic.RichTextNodeType.heading3:
      return (
        <h3 key={key} id={dasherize(element.text)}>
          {children}
        </h3>
      );
    case prismic.RichTextNodeType.heading4:
      return <h4 key={key}>{children}</h4>;
    case prismic.RichTextNodeType.heading5:
      return <h5 key={key}>{children}</h5>;
    case prismic.RichTextNodeType.heading6:
      return <h6 key={key}>{children}</h6>;
    case prismic.RichTextNodeType.paragraph:
      return <p key={key}>{children}</p>;
    case prismic.RichTextNodeType.preformatted:
      return <pre key={key}>{children}</pre>;
    case prismic.RichTextNodeType.strong:
      return <strong key={key}>{children}</strong>;
    case prismic.RichTextNodeType.em:
      return <em key={key}>{children}</em>;
    case prismic.RichTextNodeType.listItem:
      return <li key={key}>{children}</li>;
    case prismic.RichTextNodeType.oListItem:
      return <li key={key}>{children}</li>;
    case prismic.RichTextNodeType.list:
      return <ul key={key}>{children}</ul>;
    case prismic.RichTextNodeType.oList:
      return <ol key={key}>{children}</ol>;
    case prismic.RichTextNodeType.image: {
      const url = element.linkTo
        ? prismic.asLink(element.linkTo, { linkResolver })
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
    }

    case prismic.RichTextNodeType.embed:
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
    case prismic.RichTextNodeType.hyperlink: {
      const target =
        'target' in element.data ? element.data.target || undefined : undefined;
      const rel = target ? 'noopener' : undefined;
      const linkUrl = prismic.asLink(element.data, { linkResolver }) || '';
      const isDocument =
        'kind' in element.data ? element.data.kind === 'document' : false;

      const documentSize =
        isDocument && 'size' in element.data
          ? Math.round(parseInt(element.data.size) / 1000)
          : '';

      const isInPage = linkUrl.match(/^https:\/\/(#.*)/i);
      const hashLink = isInPage && isInPage[1];
      const isWorkLink = linkUrl.match(
        /^https:\/\/wellcomecollection.org\/works/i
      );

      const fileExtension = linkUrl.match(/\.[0-9a-z]+$/i);

      const documentType =
        fileExtension && fileExtension[0].substring(1).toUpperCase();

      if (isWorkLink) {
        return (
          <FeaturedWorkLink className="link-reset" link={linkUrl}>
            {children}
            <span className="visually-hidden">(view in catalogue)</span>
          </FeaturedWorkLink>
        );
      }

      if (hashLink) {
        return (
          <a key={key} target={target} rel={rel} href={hashLink}>
            {children}
          </a>
        );
      }

      if (isDocument) {
        return (
          <DownloadLink
            href={linkUrl}
            mimeType={getMimeTypeFromExtension(
              (fileExtension && fileExtension[0].substring(1)) || ''
            )}
          >
            {children}{' '}
            <span style={{ whiteSpace: 'nowrap' }}>
              <DocumentType>
                ({documentType} {documentSize}kb)
              </DocumentType>
            </span>
          </DownloadLink>
        );
      } else {
        return (
          <a key={key} target={target} href={linkUrl}>
            {children}
          </a>
        );
      }
    }

    case prismic.RichTextNodeType.label: {
      const labelClass = element.data.label || undefined;
      return (
        <span key={key} className={labelClass}>
          {children}
        </span>
      );
    }
    case prismic.RichTextNodeType.span:
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
  if (
    type === prismic.RichTextNodeType.paragraph &&
    children[0] !== undefined
  ) {
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

export const accessibilitySerializer: JSXFunctionSerializer = (
  type,
  element,
  content,
  children,
  key
) => {
  // Determine which icon to show for headings
  let icon: React.ComponentType<any> | null = null;

  // Only check text for heading elements
  if (
    element.type === prismic.RichTextNodeType.heading1 ||
    element.type === prismic.RichTextNodeType.heading2 ||
    element.type === prismic.RichTextNodeType.heading3
  ) {
    const text = element.text || '';
    const lowerText = text.toLowerCase();
    const isBSL = lowerText === 'bsl';
    const isWheelchair = lowerText === 'borrowing a wheelchair';
    const isAudioDescribed = lowerText === 'audio description';
    const isInductionLoop = lowerText === 'induction loops';

    switch (true) {
      case isBSL:
        icon = bslSquare;
        break;
      case isWheelchair:
        icon = accessible;
        break;
      case isAudioDescribed:
        icon = audioDescribed;
        break;
      case isInductionLoop:
        icon = inductionLoop;
        break;
    }
  }

  const isH1 = element.type === prismic.RichTextNodeType.heading1;
  const isH2 = element.type === prismic.RichTextNodeType.heading2;
  const isH3 = element.type === prismic.RichTextNodeType.heading3;

  switch (true) {
    case isH1:
    case isH2:
    case isH3: {
      const HeadingTag = isH1 ? 'h1' : isH2 ? 'h2' : 'h3';
      const headingProps = isH1
        ? { key }
        : { key, id: dasherize(element.text) };

      return (
        <HeadingTag {...headingProps}>
          {icon && <Icon icon={icon} />}
          {children}
        </HeadingTag>
      );
    }
    default:
      return defaultSerializer(type, element, content, children, key);
  }
};
