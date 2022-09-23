import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import { ParsedUrlQuery } from 'querystring';
import styled from 'styled-components';
import { LinkProps } from '@weco/common/model/link-props';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import NextLink from 'next/link';
import { font } from '../../../utils/classnames';
import { Filter } from '../../../services/catalogue/filters';
import { getColorDisplayName } from '../../components/PaletteColorPicker/PaletteColorPicker';
import { cross } from '@weco/common/icons';

type ResetActiveFilters = {
  query: string;
  resetFilters: LinkProps;
  filters: Filter[];
  linkResolver: (params: ParsedUrlQuery) => LinkProps;
};

const ColorSwatch = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: ${({ color }) => color};
  margin-left: 6px;
  padding-top: 2px;
`;

const Wrapper = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: 'tokens',
})`
  background-color: ${props => props.theme.newColor('white')};
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
      <Space
        className="v-align-middle"
        as="span"
        h={{
          size: 'xs',
          properties: ['margin-right'],
        }}
      >
        <Icon icon={cross} matchText={true} color="silver" />
      </Space>
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
        filterStateMap.set(filter.from.id, filter.to.value);
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
          <h2 className="inline">
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
                        query,
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
                      <a>
                        <CancelFilter text={option.label} />
                      </a>
                    </NextLink>
                  );
                });
            }

            if (f.type === 'dateRange') {
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
                      <a>
                        <CancelFilter text={`From ${f.from.value}`} />
                      </a>
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
                      <a>
                        <CancelFilter text={`To ${f.to.value}`} />
                      </a>
                    </NextLink>
                  )}
                </Fragment>
              );
            }
            if (f.type === 'color' && f.color) {
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
                    <a>
                      <CancelFilter>
                        {f.label}
                        <ColorSwatch color={`#${f.color}`}>
                          <span className="visually-hidden">
                            {getColorDisplayName(f.color)}
                          </span>
                        </ColorSwatch>
                      </CancelFilter>
                    </a>
                  </NextLink>
                </Fragment>
              );
            }
          })}

          <NextLink passHref {...resetFilters}>
            <a>
              <CancelFilter text="Reset filters" />
            </a>
          </NextLink>
        </div>
      </div>
    </Wrapper>
  );
};
