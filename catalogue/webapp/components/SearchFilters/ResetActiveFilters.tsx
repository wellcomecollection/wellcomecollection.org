import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';
import { ParsedUrlQuery } from 'querystring';

import { LinkProps } from '@weco/common/model/link-props';
import Icon from '@weco/common/views/components/Icon/Icon';
import { cross } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import { Filter } from '@weco/catalogue/services/wellcome/catalogue/filters';
import { getColorDisplayName } from '@weco/catalogue/components/PaletteColorPicker';

type ResetActiveFilters = {
  query?: string;
  resetFilters: LinkProps;
  filters: Filter[];
  linkResolver: (params: ParsedUrlQuery) => LinkProps;
};

const ColorSwatch = styled.span<{ hexColor: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: ${props => props.hexColor};
  margin-left: 6px;
  padding-top: 2px;
`;

const Wrapper = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top'] },
  className: 'tokens',
})`
  background-color: ${props => props.theme.color('white')};
`;

const IconWrapper = styled(Space).attrs({
  h: {
    size: 'xs',
    properties: ['margin-right'],
  },
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
    <Space
      as="span"
      h={{
        size: 'm',
        properties: ['margin-right'],
      }}
    >
      <IconWrapper as="span">
        <Icon icon={cross} matchText={true} iconColor="neutral.500" />
      </IconWrapper>
      <span className="visually-hidden">remove </span>
      {text || children}
    </Space>
  );
};

export const ResetActiveFilters: FunctionComponent<ResetActiveFilters> = ({
  query,
  resetFilters,
  filters,
  linkResolver,
}: ResetActiveFilters) => {
  // This is a hack until we decide exactly what it is we want the
  // reset filters to do
  const filterStateMap = new Map<string, string[] | string>();
  filters.forEach(filter => {
    if (filter.type === 'checkbox') {
      const values = filter.options
        .filter(option => option.selected)
        .map(option => option.value);

      filterStateMap.set(filter.id, values);
    }

    if (filter.type === 'dateRange') {
      if (filter.from.value) {
        filterStateMap.set(filter.from.id, filter.from.value);
      }

      if (filter.to.value) {
        filterStateMap.set(filter.to.id, filter.to.value);
      }
    }

    if (filter.type === 'color') {
      if (filter.color) {
        filterStateMap.set(filter.id, [filter.color]);
      }
    }
  });

  const filterState = Object.fromEntries(filterStateMap);

  return (
    <Wrapper>
      <div className={font('intb', 5)} role="status">
        <div>
          <h2 style={{ display: 'inline' }}>
            <Space
              as="span"
              h={{
                size: 'm',
                properties: ['margin-right'],
              }}
            >
              Active filters:
            </Space>
          </h2>
          {filters.map(f => {
            if (f.type === 'checkbox') {
              const selectedOptions = f.options.filter(
                option => option.selected
              );
              return selectedOptions
                .filter(option => option.selected)
                .map(option => {
                  return (
                    <NextLink
                      key={`cancel-${option.id}`}
                      passHref
                      {...linkResolver({
                        ...filterState,
                        ...(query && { query }),
                        page: '1',
                        [f.id]: selectedOptions
                          .filter(
                            selectedOption =>
                              option.value !== selectedOption.value
                          )
                          .map(option => option.value),
                        source: `cancel_filter/${f.id}`,
                      })}
                    >
                      <CancelFilter text={option.label} />
                    </NextLink>
                  );
                });
            } else if (f.type === 'dateRange') {
              return (
                <Fragment key={`cancel-${f.id}`}>
                  {f.from.value && (
                    <NextLink
                      passHref
                      {...linkResolver({
                        ...filterState,
                        query,
                        page: '1',
                        [f.from.id]: undefined,
                        source: `cancel_filter/${f.from.id}`,
                      })}
                    >
                      <CancelFilter text={`From ${f.from.value}`} />
                    </NextLink>
                  )}

                  {f.to.value && (
                    <NextLink
                      passHref
                      {...linkResolver({
                        ...filterState,
                        query,
                        page: '1',
                        [f.to.id]: undefined,
                        source: `cancel_filter/${f.to.id}`,
                      })}
                    >
                      <CancelFilter text={`To ${f.to.value}`} />
                    </NextLink>
                  )}
                </Fragment>
              );
            } else if (f.type === 'color' && f.color) {
              return (
                <Fragment key={`cancel-${f.id}`}>
                  <NextLink
                    passHref
                    {...linkResolver({
                      ...filterState,
                      query,
                      page: '1',
                      [f.id]: undefined,
                      source: `cancel_filter/${f.id}`,
                    })}
                  >
                    <CancelFilter>
                      {f.label}
                      <ColorSwatch hexColor={`#${f.color}`}>
                        <span className="visually-hidden">
                          {getColorDisplayName(f.color)}
                        </span>
                      </ColorSwatch>
                    </CancelFilter>
                  </NextLink>
                </Fragment>
              );
            } else {
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
