// @flow
import { useState, useRef, useContext } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { worksLink } from '../../../services/catalogue/routes';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
// $FlowFixMe (tsx)
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import TogglesContext from '../TogglesContext/TogglesContext';
import { type SearchFiltersSharedProps } from './SearchFilters';
import ButtonSolid, {
  SolidButton,
  // $FlowFixMe (tsx)
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Modal from '@weco/common/views/components/Modal/Modal';

// $FlowFixMe (tsx)
const ColorPicker = dynamic(import('../ColorPicker/ColorPicker'), {
  ssr: false,
});

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

const SearchFiltersMobile = ({
  searchForm,
  worksRouteProps,
  workTypeAggregations,
  changeHandler,
  inputDateFrom,
  inputDateTo,
  setInputDateFrom,
  setInputDateTo,
  workTypeFilters,
  productionDatesFrom,
  productionDatesTo,
  workTypeInUrlArray,
  locationsTypeInUrlArray,
  imagesColor,
  aggregations,
}: SearchFiltersSharedProps) => {
  const okFiltersButtonRef = useRef(null);
  const openButtonRef = useRef(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const { enableColorFiltering, locationsFilter } = useContext(TogglesContext);
  const showWorkTypeFilters =
    workTypeFilters.some(f => f.count > 0) || workTypeInUrlArray.length > 0;
  const showColorFilter =
    enableColorFiltering && worksRouteProps.search === 'images';
  const activeFiltersCount =
    locationsTypeInUrlArray.length +
    workTypeInUrlArray.length +
    (productionDatesFrom ? 1 : 0) +
    (productionDatesTo ? 1 : 0) +
    (imagesColor ? 1 : 0);

  return (
    <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
      <ShameButtonWrap>
        <SolidButton
          onClick={() => {
            setShowFiltersModal(true);
          }}
          aria-controls="filters-modal"
          aria-label="open filters"
          ref={openButtonRef}
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

      <Modal
        isActive={showFiltersModal}
        setIsActive={setShowFiltersModal}
        id={'filters-modal'}
        openButtonRef={openButtonRef}
      >
        <FiltersScrollable>
          <FiltersHeader>
            <h2 className="h3 text-align-center block">Filters</h2>
          </FiltersHeader>

          <FiltersBody>
            <FilterSection>
              <h3 className="h3">Dates</h3>
              <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
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
            {showWorkTypeFilters && (
              <FilterSection>
                <h3 className="h3">Formats</h3>
                <ul
                  className={classNames({
                    'no-margin no-padding plain-list': true,
                  })}
                >
                  {workTypeFilters.map(workType => {
                    const isChecked = workTypeInUrlArray.includes(
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
                          />
                        </Space>
                      )
                    );
                  })}
                </ul>
              </FilterSection>
            )}
            {locationsFilter && aggregations && aggregations.locationType && (
              <FilterSection>
                <h3 className="h3">Locations</h3>
                <ul
                  className={classNames({
                    'no-margin no-padding plain-list': true,
                  })}
                >
                  {aggregations.locationType.buckets.map(locationType => {
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
            {showColorFilter && (
              <FilterSection>
                <h3 className="h3">Colour</h3>
                <Space
                  as="span"
                  h={{ size: 'm', properties: ['margin-right'] }}
                >
                  <ColorPicker
                    color={imagesColor}
                    name="images.color"
                    onChangeColor={changeHandler}
                  />
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
            type="button"
            clickHandler={() => {
              setShowFiltersModal(false);
            }}
            text="OK"
          />
        </FiltersFooter>
      </Modal>
    </Space>
  );
};

export default SearchFiltersMobile;
