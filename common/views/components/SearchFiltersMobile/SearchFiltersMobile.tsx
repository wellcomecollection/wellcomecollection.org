import {
  useState,
  useRef,
  useEffect,
  FunctionComponent,
  ReactElement,
  useContext,
} from 'react';
import dynamic from 'next/dynamic';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { CSSTransition } from 'react-transition-group';
import getFocusableElements from '../../../utils/get-focusable-elements';
import NextLink from 'next/link';
import { worksLink } from '../../../services/catalogue/routes';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { SearchFiltersSharedProps } from '../SearchFilters/SearchFilters';
import ButtonSolid, {
  ButtonTypes,
  SolidButton,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import {
  searchFilterCheckBox,
  searchFilterCloseButton,
} from '../../../text/arial-labels';
import {
  getAggregationFilterByName,
  removeSpace,
} from '@weco/common/utils/filters';
import { CatalogueAggregationBucket } from '@weco/common/model/catalogue';
import TogglesContext from '../TogglesContext/TogglesContext';
const OldColorPicker = dynamic(import('../ColorPicker/ColorPicker'), {
  ssr: false,
});
const PaletteColorPicker = dynamic(
  import('../PaletteColorPicker/PaletteColorPicker')
);

const ShameButtonWrap = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  button {
    width: 100%;
    justify-content: center;
  }
`;

const FiltersHeader = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'border-color-pumice border-bottom-width-1 relative': true,
  }),
})``;

const CloseFiltersButton = styled(Space).attrs({
  h: { size: 'm', properties: ['left'] },
  as: 'button',
  type: 'button',
  className: classNames({
    'plain-button': true,
  }),
  'aria-label': searchFilterCloseButton,
})`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const FiltersModal = styled.div.attrs({
  'aria-modal': true,
  id: 'mobile-filters-modal',
  className: classNames({
    'bg-white': true,
  }),
})`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  transition: opacity 350ms ease, transform 350ms ease;

  &,
  &.fade-exit-done {
    z-index: -1;
    pointer-events: none;
  }

  &.fade-enter,
  &.fade-exit,
  &.fade-enter-done {
    z-index: 10;
    pointer-events: all;
  }

  &,
  &.fade-enter,
  &.fade-exit-active,
  &.fade-exit-done {
    opacity: 0;
    transform: scale(0.9);
  }

  &.fade-enter-active,
  &.fade-enter-done {
    opacity: 1;
    transform: scale(1);
  }
`;

const ActiveFilters = styled(Space).attrs({
  h: {
    size: 'xs',
    properties: ['margin-left', 'padding-left', 'padding-right'],
  },
  v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'bg-yellow font-black inline-block rounded-corners text-align-center': true,
  }),
})`
  min-width: 24px;
`;

const FiltersBody = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
})`
  input[type='number'] {
    min-width: calc(24px + 4ch);
  }
`;

const FilterSection = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'border-bottom-width-1 border-color-pumice': true,
  }),
})``;

const FiltersScrollable = styled.div.attrs({
  className: classNames({
    absolute: true,
  }),
})`
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
`;

const FiltersFooter = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'bg-white border-color-pumice border-top-width-1 flex flex--v-center flex--h-space-between': true,
  }),
})`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
`;

const SearchFiltersMobile: FunctionComponent<SearchFiltersSharedProps> = ({
  worksRouteProps,
  changeHandler,
  inputDateFrom,
  inputDateTo,
  setInputDateFrom,
  setInputDateTo,
  workTypeFilters,
  productionDatesFrom,
  productionDatesTo,
  workTypeSelected,
  locationsTypeSelected,
  imagesColor,
  aggregations,
  filtersToShow,
  languagesSelected,
  subjectsSelected,
  genresSelected,
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const openFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const closeFiltersButtonRef = useRef<HTMLDivElement>(null);
  const okFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const filtersModalRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const { searchMoreFilters } = useContext(TogglesContext);
  const languagesFilter: CatalogueAggregationBucket[] = getAggregationFilterByName(
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
  useFocusTrap(closeFiltersButtonRef, okFiltersButtonRef);

  useEffect(() => {
    function setPageScrollLock(value) {
      if (document.documentElement) {
        if (value) {
          document.documentElement.classList.add('is-scroll-locked--to-medium');
        } else {
          document.documentElement.classList.remove(
            'is-scroll-locked--to-medium'
          );
        }
      }
    }

    const focusables =
      filtersModalRef &&
      filtersModalRef.current &&
      getFocusableElements(filtersModalRef.current);

    if (isActive) {
      setPageScrollLock(true);
      focusables &&
        focusables.forEach(focusable => focusable.removeAttribute('tabIndex'));
      const firstFocusable = focusables && focusables[0];

      firstFocusable && firstFocusable.focus();
    } else {
      setPageScrollLock(false);
      focusables &&
        focusables.forEach(focusable =>
          focusable.setAttribute('tabIndex', '-1')
        );

      openFiltersButtonRef &&
        openFiltersButtonRef.current &&
        openFiltersButtonRef.current.focus();
    }
  }, [isActive]);

  function handleOkFiltersButtonClick() {
    setIsActive(false);
  }

  function handleOpenFiltersButtonClick() {
    setIsActive(true);

    closeFiltersButtonRef &&
      closeFiltersButtonRef.current &&
      closeFiltersButtonRef.current.focus();
  }

  const showWorkTypeFilters =
    workTypeFilters.some(f => f.count > 0) || workTypeSelected.length > 0;
  const activeFiltersCount =
    locationsTypeSelected.length +
    workTypeSelected.length +
    (productionDatesFrom ? 1 : 0) +
    (productionDatesTo ? 1 : 0) +
    (imagesColor ? 1 : 0) +
    languagesSelected.length +
    (subjectsSelected ? 1 : 0) +
    (genresSelected ? 1 : 0);

  const { paletteColorFilter } = useContext(TogglesContext);
  const ColorPicker = paletteColorFilter ? PaletteColorPicker : OldColorPicker;

  return (
    <Space
      v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
      className={classNames({ 'bg-white': true })}
    >
      <ShameButtonWrap>
        <SolidButton
          ref={openFiltersButtonRef}
          onClick={handleOpenFiltersButtonClick}
          aria-controls="mobile-filters-modal"
          aria-label="open filters"
        >
          <Space h={{ size: 's', properties: ['margin-right'] }}>
            <Icon name="filter" />
          </Space>
          Filters{' '}
          {activeFiltersCount > 0 && ' ' && (
            <ActiveFilters>{activeFiltersCount}</ActiveFilters>
          )}
        </SolidButton>
      </ShameButtonWrap>
      <CSSTransition in={isActive} classNames="fade" timeout={350}>
        <FiltersModal ref={filtersModalRef}>
          <FiltersScrollable>
            <FiltersHeader>
              <CloseFiltersButton
                ref={closeFiltersButtonRef}
                onClick={() => setIsActive(false)}
              >
                <Icon name="cross" />
                <span className="visually-hidden">close filters</span>
              </CloseFiltersButton>
              <h2 className="h3 text-align-center block">Filters</h2>
            </FiltersHeader>

            <FiltersBody>
              {filtersToShow.includes('dates') && (
                <FilterSection>
                  <h3 className="h3">Dates</h3>
                  <Space
                    as="span"
                    h={{ size: 'm', properties: ['margin-right'] }}
                  >
                    <NumberInput
                      label="From"
                      min="0"
                      max="9999"
                      placeholder={'Year'}
                      name="production.dates.from"
                      value={inputDateFrom || ''}
                      onChange={event => {
                        setInputDateFrom(`${event.currentTarget.value}`);
                      }}
                    />
                  </Space>
                  <NumberInput
                    label="to"
                    min="0"
                    max="9999"
                    placeholder={'Year'}
                    name="production.dates.to"
                    value={inputDateTo || ''}
                    onChange={event => {
                      setInputDateTo(`${event.currentTarget.value}`);
                    }}
                  />
                </FilterSection>
              )}
              {showWorkTypeFilters &&
                showWorkTypeFilters &&
                filtersToShow.includes('formats') && (
                  <FilterSection>
                    <h3 className="h3">Formats</h3>
                    <ul
                      className={classNames({
                        'no-margin no-padding plain-list': true,
                      })}
                    >
                      {workTypeFilters.map(workType => {
                        const isChecked = workTypeSelected.includes(
                          workType.data.id
                        );

                        return (
                          (workType.count > 0 || isChecked) && (
                            <Space
                              as="li"
                              v={{ size: 'l', properties: ['margin-bottom'] }}
                              key={`mobile-${workType.data.id}`}
                            >
                              <CheckboxRadio
                                id={`mobile-${workType.data.id}`}
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
                            </Space>
                          )
                        );
                      })}
                    </ul>
                  </FilterSection>
                )}
              {aggregations && aggregations.locationType && (
                <FilterSection>
                  <h3 className="h3">Locations</h3>
                  <ul
                    className={classNames({
                      'no-margin no-padding plain-list': true,
                    })}
                  >
                    {aggregations.locationType.buckets
                      .sort((a, b) => b.data.label.localeCompare(a.data.label)) // Ensure 'Online' appears before 'In the library'
                      .map(locationType => {
                        const isChecked = worksRouteProps.itemsLocationsType.includes(
                          locationType.data.type
                        );

                        return (
                          (locationType.count > 0 || isChecked) && (
                            <Space
                              as="li"
                              v={{ size: 'l', properties: ['margin-bottom'] }}
                              key={`mobile-${locationType.data.type}`}
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
                          )
                        );
                      })}
                  </ul>
                </FilterSection>
              )}
              {filtersToShow.includes('colors') && (
                <FilterSection>
                  <h3 className="h3">Colour</h3>
                  <Space
                    as="span"
                    h={{ size: 'm', properties: ['margin-right'] }}
                  >
                    <ColorPicker
                      color={imagesColor || undefined}
                      name="images.color"
                      onChangeColor={changeHandler}
                    />
                  </Space>
                </FilterSection>
              )}
              {searchMoreFilters && filtersToShow.includes('subjects') && (
                <FilterSection>
                  <h3 className="h3">Subjects</h3>
                  <Space
                    as="span"
                    h={{ size: 'm', properties: ['margin-right'] }}
                  >
                    {filtersToShow.length > 0 && (
                      <ul
                        className={classNames({
                          'no-margin no-padding plain-list': true,
                        })}
                      >
                        {subjectsFilter.map(subject => {
                          const isChecked = subjectsSelected.includes(
                            subject.data.label
                          );

                          return (
                            (subject.count > 0 || isChecked) && (
                              <Space
                                as="li"
                                v={{ size: 'l', properties: ['margin-bottom'] }}
                                key={`mobile-${subject.data.label}`}
                              >
                                <CheckboxRadio
                                  id={`mobile-${removeSpace(
                                    subject.data.label
                                  )}`}
                                  type={`checkbox`}
                                  text={`${subject.data.label} (${subject.count})`}
                                  value={subject.data.label}
                                  name={`subjects`}
                                  checked={isChecked}
                                  onChange={changeHandler}
                                  ariaLabel={searchFilterCheckBox(
                                    subject.data.label
                                  )}
                                />
                              </Space>
                            )
                          );
                        })}
                      </ul>
                    )}
                  </Space>
                </FilterSection>
              )}
              {searchMoreFilters && filtersToShow.includes('genres') && (
                <FilterSection>
                  <h3 className="h3">Genres</h3>
                  <Space
                    as="span"
                    h={{ size: 'm', properties: ['margin-right'] }}
                  >
                    {filtersToShow.length > 0 && (
                      <ul
                        className={classNames({
                          'no-margin no-padding plain-list': true,
                        })}
                      >
                        {genresFilter.map(genre => {
                          const isChecked = genresSelected.includes(
                            genre.data.label
                          );

                          return (
                            (genre.count > 0 || isChecked) && (
                              <Space
                                as="li"
                                v={{ size: 'l', properties: ['margin-bottom'] }}
                                key={`mobile-${genre.data.label}`}
                              >
                                <CheckboxRadio
                                  id={`mobile-${removeSpace(genre.data.label)}`}
                                  type={`checkbox`}
                                  text={`${genre.data.label} (${genre.count})`}
                                  value={genre.data.label}
                                  name={`genres`}
                                  checked={isChecked}
                                  onChange={changeHandler}
                                  ariaLabel={searchFilterCheckBox(
                                    genre.data.label
                                  )}
                                />
                              </Space>
                            )
                          );
                        })}
                      </ul>
                    )}
                  </Space>
                </FilterSection>
              )}
              {searchMoreFilters && filtersToShow.includes('languages') && (
                <FilterSection>
                  <h3 className="h3">Languages</h3>
                  <Space
                    as="span"
                    h={{ size: 'm', properties: ['margin-right'] }}
                  >
                    {filtersToShow.length > 0 && (
                      <ul
                        className={classNames({
                          'no-margin no-padding plain-list': true,
                        })}
                      >
                        {languagesFilter.map(language => {
                          const isChecked = languagesSelected.includes(
                            language.data.id
                          );

                          return (
                            (language.count > 0 || isChecked) && (
                              <Space
                                as="li"
                                v={{ size: 'l', properties: ['margin-bottom'] }}
                                key={`mobile-${language.data.id}`}
                              >
                                <CheckboxRadio
                                  id={`mobile-${language.data.id}`}
                                  type={`checkbox`}
                                  text={`${language.data.label} (${language.count})`}
                                  value={language.data.id}
                                  name={`languages`}
                                  checked={isChecked}
                                  onChange={changeHandler}
                                  ariaLabel={searchFilterCheckBox(
                                    language.data.label
                                  )}
                                />
                              </Space>
                            )
                          );
                        })}
                      </ul>
                    )}
                  </Space>
                </FilterSection>
              )}
            </FiltersBody>
          </FiltersScrollable>

          <FiltersFooter>
            <NextLink
              passHref
              {...worksLink(
                {
                  query: worksRouteProps.query,
                },
                'cancel_filter/all'
              )}
            >
              <a>Reset filters</a>
            </NextLink>

            <ButtonSolid
              ref={okFiltersButtonRef}
              type={ButtonTypes.button}
              clickHandler={handleOkFiltersButtonClick}
              text="Show results"
            />
          </FiltersFooter>
        </FiltersModal>
      </CSSTransition>
    </Space>
  );
};

export default SearchFiltersMobile;
