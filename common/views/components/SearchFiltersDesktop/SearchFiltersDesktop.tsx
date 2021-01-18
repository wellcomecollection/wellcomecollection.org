import React, {
  FunctionComponent,
  ReactElement,
  useRef,
  useState,
} from 'react';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';

import dynamic from 'next/dynamic';
import { SearchFiltersSharedProps } from '../SearchFilters/SearchFilters';
import ModalMoreFilters from '../ModalMoreFilters/ModalMoreFilters';
import ButtonInline from '../ButtonInline/ButtonInline';
import { searchFilterCheckBox } from '../../../text/arial-labels';
import { getResetFilterLink } from '@weco/common/utils/filters';
import { ResetActiveFilters } from '../ResetActiveFilters/ResetActiveFilters';

const ColorPicker = dynamic(import('../ColorPicker/ColorPicker'), {
  ssr: false,
});

const SearchFiltersDesktop: FunctionComponent<SearchFiltersSharedProps> = ({
  filtersToShow,
  worksRouteProps,
  changeHandler,
  inputDateFrom,
  inputDateTo,
  setInputDateFrom,
  setInputDateTo,
  workTypeFilters,
  productionDatesFrom,
  productionDatesTo,
  workTypeInUrlArray,
  imagesColor,
  aggregations,
  enableMoreFilters,
  languagesInUrl,
  subjectsInUrl,
  genresInUrl,
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const showWorkTypeFilters =
    workTypeFilters.some(f => f.count > 0) || workTypeInUrlArray.length > 0;

  const resetFiltersRoute = {
    ...worksRouteProps,
    itemsLocationsLocationType: [],
    itemsLocationsType: [],
    workType: [],
    page: 1,
    productionDatesFrom: null,
    productionDatesTo: null,
    subjects: null,
    genres: null,
  };

  const [showMoreFiltersModal, setMoreFiltersModal] = useState(false);
  const openMoreFiltersButtonRef = useRef(null);
  const resetFilters = getResetFilterLink(imagesColor, resetFiltersRoute);

  function showActiveFilters() {
    return (
      imagesColor ||
      ((productionDatesFrom ||
        productionDatesTo ||
        workTypeInUrlArray.length > 0 ||
        worksRouteProps?.itemsLocationsType?.length > 0) &&
        workTypeFilters.length > 0) ||
      languagesInUrl.length > 0
    );
  }

  return (
    <>
      <Space
        v={{
          size: 'm',
          properties: ['padding-top'],
        }}
        className={classNames({
          'flex bg-pumice': true,
        })}
      >
        <Space
          h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          className={classNames({
            'flex flex--h-space-between flex--v-center full-width flex--wrap': true,
          })}
        >
          <Space
            v={{ size: 'm', properties: ['margin-bottom'] }}
            className={classNames({
              'flex flex--v-center': true,
            })}
          >
            <Space
              as="span"
              h={{ size: 'm', properties: ['margin-right'] }}
              className={classNames({
                'flex flex--v-center': true,
              })}
            >
              <Icon name="filter" />
              <Space
                h={{ size: 's', properties: ['margin-left'] }}
                className={classNames({
                  [font('hnm', 5)]: true,
                })}
              >
                Filter by
              </Space>
            </Space>

            {showWorkTypeFilters && filtersToShow.includes('formats') && (
              <Space h={{ size: 's', properties: ['margin-right'] }}>
                <DropdownButton label={'Formats'} isInline={true} id="formats">
                  <ul
                    className={classNames({
                      'no-margin no-padding plain-list': true,
                      [font('hnl', 5)]: true,
                    })}
                  >
                    {workTypeFilters.map(workType => {
                      const isChecked = workTypeInUrlArray.includes(
                        workType.data.id
                      );

                      return (
                        (workType.count > 0 || isChecked) && (
                          <li key={workType.data.id}>
                            <CheckboxRadio
                              id={workType.data.id}
                              type={`checkbox`}
                              text={`${workType.data.label} (${workType.count})`}
                              value={workType.data.id}
                              name={`workType`}
                              checked={isChecked}
                              onChange={changeHandler}
                              ariaLabel={searchFilterCheckBox(
                                workType.data.label
                              )}
                            />
                          </li>
                        )
                      );
                    })}
                  </ul>
                </DropdownButton>
              </Space>
            )}

            {filtersToShow.includes('dates') && (
              <Space
                className={classNames({
                  [font('hnl', 5)]: true,
                })}
              >
                <DropdownButton label={'Dates'} isInline={true} id="dates">
                  <>
                    <Space
                      as="span"
                      h={{ size: 'm', properties: ['margin-right'] }}
                    >
                      <NumberInput
                        name="production.dates.from"
                        label="From"
                        min="0"
                        max="9999"
                        placeholder={'Year'}
                        value={inputDateFrom || ''}
                        onChange={event => {
                          setInputDateFrom(`${event.currentTarget.value}`);
                        }}
                      />
                    </Space>
                    <NumberInput
                      name="production.dates.to"
                      label="to"
                      min="0"
                      max="9999"
                      placeholder={'Year'}
                      value={inputDateTo || ''}
                      onChange={event => {
                        setInputDateTo(`${event.currentTarget.value}`);
                      }}
                    />
                  </>
                </DropdownButton>
              </Space>
            )}

            {filtersToShow.includes('colors') && (
              <Space
                className={classNames({
                  [font('hnl', 5)]: true,
                })}
              >
                <DropdownButton
                  label={'Colours'}
                  isInline={true}
                  id="images.color"
                >
                  <ColorPicker
                    name="images.color"
                    color={imagesColor}
                    onChangeColor={changeHandler}
                  />
                </DropdownButton>
              </Space>
            )}
            {enableMoreFilters && !filtersToShow.includes('colors') && (
              <Space
                className={classNames({
                  [font('hnl', 5)]: true,
                })}
                h={{ size: 's', properties: ['margin-left'] }}
              >
                <ButtonInline
                  text="More Filters"
                  clickHandler={event => {
                    event.preventDefault();
                    setMoreFiltersModal(true);
                  }}
                  ref={openMoreFiltersButtonRef}
                />
                <ModalMoreFilters
                  id="moreFilters"
                  showMoreFiltersModal={showMoreFiltersModal}
                  setMoreFiltersModal={setMoreFiltersModal}
                  openMoreFiltersButtonRef={openMoreFiltersButtonRef}
                  filtersToShow={filtersToShow}
                  aggregations={aggregations}
                  changeHandler={changeHandler}
                  languagesInUrl={languagesInUrl}
                  subjectsInUrl={subjectsInUrl}
                  genresInUrl={genresInUrl}
                />
              </Space>
            )}
          </Space>

          {filtersToShow.includes('locations') &&
            aggregations &&
            aggregations.locationType && (
              <Space
                v={{ size: 'm', properties: ['margin-bottom'] }}
                className={classNames({
                  'flex flex--v-center': true,
                })}
              >
                <Icon name="eye" />
                <Space
                  h={{ size: 's', properties: ['margin-left'] }}
                  className={classNames({
                    [font('hnm', 5)]: true,
                  })}
                >
                  Show items available
                </Space>
                <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
                  <ul
                    className={classNames({
                      'no-margin no-padding plain-list flex': true,
                      [font('hnl', 5)]: true,
                    })}
                  >
                    {aggregations.locationType.buckets
                      .sort((a, b) => b.data.label.localeCompare(a.data.label)) // Ensure 'Online' appears before 'In the library'
                      .map(locationType => {
                        const isChecked = worksRouteProps.itemsLocationsType.includes(
                          locationType.data.type
                        );

                        return (
                          <Space
                            as="li"
                            h={{ size: 's', properties: ['margin-left'] }}
                            key={locationType.data.type}
                            className={classNames({
                              flex: true,
                            })}
                          >
                            <CheckboxRadio
                              id={locationType.data.type}
                              type={`checkbox`}
                              text={`${locationType.data.label} (${locationType.count})`}
                              value={locationType.data.type}
                              name={`items.locations.type`}
                              checked={isChecked}
                              onChange={changeHandler}
                            />
                          </Space>
                        );
                      })}
                  </ul>
                </Space>
              </Space>
            )}
        </Space>
      </Space>

      {showActiveFilters() && (
        <ResetActiveFilters
          workTypeFilters={workTypeFilters}
          productionDatesFrom={productionDatesFrom}
          productionDatesTo={productionDatesTo}
          worksRouteProps={worksRouteProps}
          imagesColor={imagesColor}
          workTypeInUrlArray={workTypeInUrlArray}
          aggregations={aggregations}
          resetFilters={resetFilters}
          enableMoreFilters={enableMoreFilters}
          languagesInUrl={languagesInUrl}
          subjectsInUrl={subjectsInUrl}
          genresInUrl={genresInUrl}
        />
      )}
    </>
  );
};

export default SearchFiltersDesktop;
