import { font, classNames } from '../../../utils/classnames';
import { breadcrumbsLd } from '../../../utils/json-ld';
import Space from '../styled/Space';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { BreadcrumbItems } from '../../../model/breadcrumbs';

const ItemWrapper = styled(Space).attrs(() => ({
  className: classNames({
    [font('intr', 6)]: true,
  }),
}))``;

const Breadcrumb: FunctionComponent<BreadcrumbItems> = ({
  items,
}: BreadcrumbItems): ReactElement => (
  <div
    className={classNames({
      flex: true,
    })}
  >
    {items
      .filter(({ isHidden }) => !isHidden)
      .map(({ text, url, prefix }, i) => {
        const LinkOrSpanTag = url ? 'a' : 'span';
        return (
          <ItemWrapper key={text} as={prefix ? 'b' : 'span'}>
            {i > 0 && (
              <Space
                as="span"
                h={{ size: 's', properties: ['margin-left', 'margin-right'] }}
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
            >
              {text}
            </LinkOrSpanTag>
          </ItemWrapper>
        );
      })}
    {/* We do this so that the page doesn't bounce around if we don't have any breadcrumbs */}
    {items.length === 0 && (
      <span
        className={classNames({
          [font('intr', 6)]: true,
          'empty-filler': true,
        })}
        style={{ lineHeight: 1 }}
      />
    )}
    {items.length > 0 && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsLd({ items })),
        }}
      />
    )}
  </div>
);
export default Breadcrumb;
