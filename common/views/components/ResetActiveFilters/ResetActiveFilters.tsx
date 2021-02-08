import React, { FunctionComponent, ReactNode, useContext } from 'react';
import { LinkProps } from '@weco/common/model/link-props';
import {
  CatalogueAggregationBucket,
  CatalogueAggregations,
} from '@weco/common/model/catalogue';
import {
  worksLink,
  imagesLink,
  WorksRouteProps,
} from '../../../services/catalogue/ts_routes';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import NextLink from 'next/link';
import { font, classNames } from '../../../utils/classnames';
import styled from 'styled-components';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import {
  getAggregationFilterByName,
  replaceSpaceWithHypen,
} from '../../../utils/filters';

type ResetActiveFilters = {
  workTypeFilters: CatalogueAggregationBucket[];
  productionDatesFrom: string | null;
  productionDatesTo: string | null;
  worksRouteProps: WorksRouteProps;
  imagesColor: string | null;
  workTypeSelected: string[];
  aggregations?: CatalogueAggregations;
  resetFilters: LinkProps;
  languagesSelected: string[];
  subjectsSelected: string[];
  genresSelected: string[];
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
  workTypeFilters,
  productionDatesFrom,
  productionDatesTo,
  worksRouteProps,
  imagesColor,
  workTypeSelected,
  aggregations,
  resetFilters,
  languagesSelected,
  subjectsSelected,
  genresSelected,
}: ResetActiveFilters) => {
  const languageFilters: CatalogueAggregationBucket[] = getAggregationFilterByName(
    aggregations,
    'languages'
  );
  const subjectsFilter: CatalogueAggregationBucket[] = getAggregationFilterByName(
    aggregations,
    'subjects'
  );
  const genresFilter: CatalogueAggregationBucket[] = getAggregationFilterByName(
    aggregations,
    'genres'
  );

  const { searchMoreFilters } = useContext(TogglesContext);
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
          {productionDatesFrom && (
            <NextLink
              passHref
              {...worksLink(
                {
                  ...worksRouteProps,
                  page: 1,
                  productionDatesFrom: null,
                },
                'cancel_filter/production_dates_from'
              )}
            >
              <a>
                <CancelFilter text={`From ${productionDatesFrom}`} />
              </a>
            </NextLink>
          )}
          {productionDatesTo && (
            <NextLink
              passHref
              {...worksLink(
                {
                  ...worksRouteProps,
                  page: 1,
                  productionDatesTo: null,
                },
                'cancel_filter/production_dates_to'
              )}
            >
              <a>
                <CancelFilter text={`To ${productionDatesTo}`} />
              </a>
            </NextLink>
          )}
          {imagesColor && (
            <NextLink
              passHref
              {...imagesLink(
                {
                  ...worksRouteProps,
                  page: 1,
                  color: null,
                  locationsLicense: null,
                },
                'cancel_filter/images_color'
              )}
            >
              <a>
                <CancelFilter>
                  Colour
                  <ColorSwatch color={`#${imagesColor}`} />
                </CancelFilter>
              </a>
            </NextLink>
          )}

          {workTypeSelected.map(id => {
            const workTypeObject = workTypeFilters.find(({ data }) => {
              return data.id === id;
            });

            return (
              workTypeObject && (
                <NextLink
                  key={id}
                  {...worksLink(
                    {
                      ...worksRouteProps,
                      workType: worksRouteProps.workType.filter(
                        w => w !== workTypeObject.data.id
                      ),
                      page: 1,
                    },
                    'cancel_filter/work_types'
                  )}
                >
                  <a>
                    <CancelFilter text={workTypeObject.data.label} />
                  </a>
                </NextLink>
              )
            );
          })}

          {aggregations &&
            aggregations.locationType.buckets
              .filter(locationType =>
                worksRouteProps.itemsLocationsType.includes(
                  locationType.data.type
                )
              )
              .map(locationType => (
                <NextLink
                  key={locationType.type}
                  passHref
                  {...worksLink(
                    {
                      ...worksRouteProps,
                      itemsLocationsType: worksRouteProps.itemsLocationsType.filter(
                        type => type !== locationType.data.type
                      ),
                      page: 1,
                    },
                    'cancel_filter/items_locations_type'
                  )}
                >
                  <a>
                    <CancelFilter text={locationType.data.label} />
                  </a>
                </NextLink>
              ))}

          {searchMoreFilters &&
            languagesSelected.map(id => {
              const language = languageFilters.find(({ data }) => {
                return data.id === id;
              });

              return (
                language && (
                  <NextLink
                    key={id}
                    {...worksLink(
                      {
                        ...worksRouteProps,
                        languages:
                          worksRouteProps.languages &&
                          worksRouteProps.languages.filter(
                            w => w !== language.data.id
                          ),
                        page: 1,
                      },
                      'cancel_filter/languages'
                    )}
                  >
                    <a>
                      <CancelFilter text={language.data.label} />
                    </a>
                  </NextLink>
                )
              );
            })}
          {searchMoreFilters &&
            subjectsSelected.map(subject => {
              const subjectActive = subjectsFilter.find(({ data }) => {
                return data.label === decodeURIComponent(subject);
              });
              return (
                subjectActive && (
                  <NextLink
                    key={replaceSpaceWithHypen(subjectActive.data.label)}
                    {...worksLink(
                      {
                        ...worksRouteProps,
                        subjectsLabel:
                          worksRouteProps.subjectsLabel &&
                          worksRouteProps.subjectsLabel.filter(
                            w => w !== subjectActive.data.label
                          ),
                        page: 1,
                      },
                      'cancel_filter/subjects_label'
                    )}
                  >
                    <a>
                      <CancelFilter text={subjectActive.data.label} />
                    </a>
                  </NextLink>
                )
              );
            })}
          {searchMoreFilters &&
            genresSelected.map(subject => {
              const genreActive = genresFilter.find(({ data }) => {
                return data.label === decodeURIComponent(subject);
              });
              return (
                genreActive && (
                  <NextLink
                    key={replaceSpaceWithHypen(genreActive.data.label)}
                    {...worksLink(
                      {
                        ...worksRouteProps,
                        genresLabel:
                          worksRouteProps.genresLabel &&
                          worksRouteProps.genresLabel.filter(
                            w => w !== genreActive.data.label
                          ),
                        page: 1,
                      },
                      'cancel_filter/genres_label'
                    )}
                  >
                    <a>
                      <CancelFilter text={genreActive.data.label} />
                    </a>
                  </NextLink>
                )
              );
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
