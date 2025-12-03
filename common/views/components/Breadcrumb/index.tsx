import { FunctionComponent } from 'react';

import { BreadcrumbItems, Breadcrumbs } from '@weco/common/model/breadcrumbs';
import { classNames, font } from '@weco/common/utils/classnames';
import { breadcrumbsLd } from '@weco/common/utils/json-ld';
import { links } from '@weco/common/views/components/Header';
import Space from '@weco/common/views/components/styled/Space';

export function getBreadcrumbItems(
  siteSection?: string,
  custom?: Breadcrumbs
): BreadcrumbItems {
  if (!siteSection) return { items: [] };

  return {
    items: siteSection
      ? [
          {
            text:
              links.find(link => link.siteSection === siteSection)?.title ||
              siteSection,
            url: siteSection ? `/${siteSection}` : '',
          },
          ...(custom || []),
        ]
      : [],
  };
}

const Breadcrumb: FunctionComponent<BreadcrumbItems> = ({
  items,
  noHomeLink,
}) => {
  // We prepend a 'Home' breadcrumb at the start of every chain, so every page
  // will ideally always have a visible breadcrumb.
  const allItems = [
    {
      text: 'Home',
      url: '/',
      isHidden: noHomeLink,
    },
    ...items,
  ];

  const visibleItems = allItems.filter(({ isHidden }) => !isHidden);

  if (visibleItems.length === 0) return null;

  return (
    // TODO remove is-hidden-print class once we've made the breadcrumbs more useful
    <div
      data-component="breadcrumb"
      className="is-hidden-print"
      data-testid="breadcrumbs"
    >
      {visibleItems.map(({ text, url, prefix }, i) => {
        const LinkOrSpanTag = url ? 'a' : 'span';

        return (
          <Space
            key={prefix ? `${prefix}-${text}` : text}
            as={prefix ? 'b' : 'span'}
            className={font('intr', -2)}
          >
            {i > 0 && (
              <Space
                as="span"
                $h={{ size: 's', properties: ['margin-left', 'margin-right'] }}
                aria-hidden="true"
              >
                |
              </Space>
            )}
            {prefix}{' '}
            <LinkOrSpanTag
              className={classNames({
                [font('intsb', -2)]: Boolean(prefix),
              })}
              href={url}
              data-gtm-trigger={url ? 'breadcrumb_link' : undefined}
            >
              {text}
            </LinkOrSpanTag>
          </Space>
        );
      })}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsLd({ items })),
        }}
      />
    </div>
  );
};
export default Breadcrumb;
