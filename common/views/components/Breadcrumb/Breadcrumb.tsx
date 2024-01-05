import { font, classNames } from '@weco/common/utils/classnames';
import { breadcrumbsLd } from '@weco/common/utils/json-ld';
import Space from '@weco/common/views/components/styled/Space';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { BreadcrumbItems } from '../../../model/breadcrumbs';

const BreadcrumbWrapper = styled.div`
  display: flex;
`;

const ItemWrapper = styled(Space).attrs({
  className: font('intr', 6),
})``;

const Breadcrumb: FunctionComponent<BreadcrumbItems> = ({ items }) => {
  // We prepend a 'Home' breadcrumb at the start of every chain, so every page
  // will always have a visible breadcrumb.
  const visibleItems = [
    {
      text: 'Home',
      url: '/',
    },
    ...items.filter(({ isHidden }) => !isHidden),
  ];

  return (
    // TODO remove is-hidden-print class once we've made the breadcrumbs more useful
    <BreadcrumbWrapper className="is-hidden-print" data-testid="breadcrumbs">
      {visibleItems.map(({ text, url, prefix }, i) => {
        const LinkOrSpanTag = url ? 'a' : 'span';
        return (
          <ItemWrapper
            key={prefix ? `${prefix}-${text}` : text}
            as={prefix ? 'b' : 'span'}
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
                [font('intb', 6)]: Boolean(prefix),
              })}
              href={url}
              data-gtm-trigger={url ? 'breadcrumb_link' : undefined}
            >
              {text}
            </LinkOrSpanTag>
          </ItemWrapper>
        );
      })}
      {/* Because we always insert a 'Home' breadcrumb, we know it will be non-empty. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsLd({ items })),
        }}
      />
    </BreadcrumbWrapper>
  );
};
export default Breadcrumb;
