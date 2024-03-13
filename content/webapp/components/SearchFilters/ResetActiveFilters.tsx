import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ParsedUrlQuery } from 'querystring';

import { LinkProps } from '@weco/common/model/link-props';
import Icon from '@weco/common/views/components/Icon/Icon';
import { cross } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import {
  CheckboxFilter,
  ColorFilter,
  DateRangeFilter,
  Filter,
} from '@weco/content/services/wellcome/common/filters';
import { getColorDisplayName } from '@weco/content/components/PaletteColorPicker';

type ResetActiveFilters = {
  resetFilters: LinkProps;
  filters: Filter[];
  linkResolver: (params: ParsedUrlQuery) => LinkProps;
};

const ColorSwatch = styled.span<{ $hexColor: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: ${props => props.$hexColor};
  margin-left: 6px;
  padding-top: 2px;
`;

const Wrapper = styled(Space).attrs({
  className: 'tokens',
  $v: { size: 's', properties: ['padding-top'] },
})`
  background-color: ${props => props.theme.color('white')};
`;

const IconWrapper = styled(Space).attrs({
  $h: { size: 'xs', properties: ['margin-right'] },
})`
  vertical-align: middle;
`;

type CancelFilterProps = {
  text?: string;
  children?: ReactNode;
};

const CancelFilter: FunctionComponent<CancelFilterProps> = ({
  text,
  children,
}: CancelFilterProps) => {
  return (
    <Space as="span" $h={{ size: 'm', properties: ['margin-right'] }}>
      <IconWrapper as="span">
        <Icon icon={cross} matchText={true} iconColor="neutral.500" />
      </IconWrapper>
      <span className="visually-hidden">remove </span>
      {text || children}
    </Space>
  );
};

export const ResetActiveFilters: FunctionComponent<ResetActiveFilters> = ({
  filters,
  resetFilters,
  linkResolver,
}: ResetActiveFilters) => {
  const router = useRouter();
  const renderCheckboxLink = (filter: CheckboxFilter) =>
    filter.options
      .filter(({ selected }) => selected)
      .map(option => (
        <NextLink
          key={`cancel-${option.id}`}
          passHref
          {...linkResolver({
            ...router.query,
            page: '1',
            [filter.id]: filter.options
              .filter(
                ({ selected, value }) => selected && value !== option.value
              )
              .map(({ value }) => value),
            source: `cancel_filter/${filter.id}`,
          })}
        >
          <CancelFilter text={option.label} />
        </NextLink>
      ));

  const renderDateRangeLinks = (filter: DateRangeFilter) => {
    const renderIndividualLink = (
      prefix: string,
      f: DateRangeFilter['from'] | DateRangeFilter['to']
    ) => (
      <NextLink
        passHref
        {...linkResolver({
          ...router.query,
          page: '1',
          [f.id]: undefined,
          source: `cancel_filter/${f.id}`,
        })}
      >
        <CancelFilter text={`${prefix} ${f.value}`} />
      </NextLink>
    );
    return (
      <Fragment key={`cancel-${filter.id}`}>
        {filter.from.value ? renderIndividualLink('From', filter.from) : null}
        {filter.to.value ? renderIndividualLink('To', filter.to) : null}
      </Fragment>
    );
  };

  const renderColorLink = (filter: ColorFilter) =>
    filter.color ? (
      <Fragment key={`cancel-${filter.id}`}>
        <NextLink
          passHref
          {...linkResolver({
            ...router.query,
            page: '1',
            [filter.id]: undefined,
            source: `cancel_filter/${filter.id}`,
          })}
        >
          <CancelFilter>
            {filter.label}
            <ColorSwatch $hexColor={`#${filter.color}`}>
              <span className="visually-hidden">
                {getColorDisplayName(filter.color)}
              </span>
            </ColorSwatch>
          </CancelFilter>
        </NextLink>
      </Fragment>
    ) : null;

  return (
    <Wrapper>
      <div className={font('intb', 5)}>
        <div>
          <h2 style={{ display: 'inline' }}>
            <Space as="span" $h={{ size: 'm', properties: ['margin-right'] }}>
              Active filters:
            </Space>
          </h2>
          {filters.map(f => {
            switch (f.type) {
              case 'checkbox':
                return renderCheckboxLink(f);
              case 'dateRange':
                return renderDateRangeLinks(f);
              case 'color':
                return renderColorLink(f);
              default:
                return null;
            }
          })}
          <NextLink passHref {...resetFilters}>
            <CancelFilter text="Reset filters" />
          </NextLink>
        </div>
      </div>
    </Wrapper>
  );
};
