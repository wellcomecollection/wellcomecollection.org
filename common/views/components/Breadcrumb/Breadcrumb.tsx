import { font, classNames } from '../../../utils/classnames';
import { breadcrumbsLd } from '../../../utils/json-ld';
import Space from '../styled/Space';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { BreadcrumbItems } from '../../../model/breadcrumbs';

type ItemWrapperProps = {
  isFirst: boolean;
};

const ItemWrapper = styled(Space).attrs<ItemWrapperProps>(props => ({
  h: {
    size: 'm',
    properties: [
      'padding-right',
      !props.isFirst ? 'padding-left' : undefined,
    ].filter(Boolean),
  },
  className: classNames({
    [font('hnr', 5)]: true,
  }),
}))<ItemWrapperProps>`
  ${props =>
    !props.isFirst &&
    `
  border-left: 1px solid ${props.theme.color('black')};
`}
`;

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
          <ItemWrapper isFirst={i === 0} key={text} as={prefix ? 'b' : 'span'}>
            {prefix}{' '}
            <LinkOrSpanTag
              className={classNames({
                [font('hnb', 5)]: Boolean(prefix),
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
          [font('hnr', 5)]: true,
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
