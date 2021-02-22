import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import { LinkProps } from '@weco/common/model/link-props';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import NextLink from 'next/link';
import { font, classNames } from '../../../utils/classnames';
import styled from 'styled-components';
import { Filter } from '../SearchFilters/SearchFilters';
import { toLink as worksLink, WorksProps } from '../WorksLink/WorksLink';

type ResetActiveFilters = {
  resetFilters: LinkProps;
  filters: Filter[];
};

const ColorSwatch = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: ${({ color }) => color};
  margin-left: 6px;
  padding-top: 2px;
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
        as="span"
        h={{
          size: 'xs',
          properties: ['margin-right'],
        }}
      >
        <Icon
          name="cross"
          extraClasses="icon--match-text icon--silver v-align-middle"
        />
      </Space>
      <span className="visually-hidden">remove </span>
      {text || children}
    </Space>
  );
};

export const ResetActiveFilters: FunctionComponent<ResetActiveFilters> = ({
  resetFilters,
  filters,
}: ResetActiveFilters) => {
  const query = '???';

  return (
    <Space
      v={{ size: 's', properties: ['padding-top'] }}
      h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
      className="tokens bg-white"
    >
      <div className={classNames({ [font('hnm', 5)]: true })}>
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
          {filters.map((f) => {
            if (f.type === 'checkbox') {
              const selectedOptions = f.options.filter(
                (option) => option.selected
              );
              return selectedOptions
                .filter((option) => option.selected)
                .map((option) => {
                  return (
                    <NextLink
                      key={`cancel-${option.id}`}
                      passHref
                      {...worksLink({
                        ...query,
                        page: 1,
                        [f.key]: selectedOptions
                          .filter(
                            (selectedOption) =>
                              option.value !== selectedOption.value
                          )
                          .map((option) => option.value),
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
                      {...worksLink({
                        ...query,
                        page: 1,
                        [f.from.key]: undefined,
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
                      {...worksLink({
                        ...query,
                        page: 1,
                        [f.to.key]: undefined,
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
            if (f.type === 'color') {
              return (
                <Fragment key={`cancel-${f.id}`}>
                  <NextLink
                    passHref
                    {...worksLink({
                      ...query,
                      page: 1,
                      [f.key]: undefined,
                      source: `cancel_filter/${f.id}`,
                    })}
                  >
                    <a>
                      <CancelFilter>
                        {f.label}
                        <ColorSwatch color={`#${f.color}`} />
                      </CancelFilter>
                    </a>
                  </NextLink>
                </Fragment>
              );
            }
          })}

          <NextLink passHref {...resetFilters}>
            <a>
              <CancelFilter text={'Reset filters'} />
            </a>
          </NextLink>
        </div>
      </div>
    </Space>
  );
};
