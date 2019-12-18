import { useState } from 'react';
import NextLink from 'next/link';
import { worksUrl } from '../../../services/catalogue/urls';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import Checkbox from '@weco/common/views/components/Checkbox/Checkbox';

const FiltersButton = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  as: 'button',
  type: 'button',
  className: classNames({
    'btn btn--primary': true,
  }),
})`
  width: 100%;
  display: block;
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
})`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const FiltersModal = styled.div.attrs({
  className: classNames({
    'bg-white': true,
  }),
})`
  display: ${props => (props.isActive ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
`;

const FiltersBody = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
})``;

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
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
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
  searchParams,
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
}) => {
  const [isActive, setIsActive] = useState(false);

  function handleApplyFilters() {
    setIsActive(false);
  }

  return (
    <div className="is-hidden-m is-hidden-l">
      <FiltersButton onClick={() => setIsActive(!isActive)}>
        <Icon name="filter" />
        <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
          Filter
        </Space>
      </FiltersButton>
      <FiltersModal isActive={isActive}>
        <FiltersScrollable>
          <FiltersHeader>
            <CloseFiltersButton onClick={() => setIsActive(false)}>
              <Icon name="cross" />
              <span className="visually-hidden">close filters</span>
            </CloseFiltersButton>
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
            {workTypeFilters.length > 0 && (
              <FilterSection>
                <h3 className="h3">Formats</h3>
                <ul
                  className={classNames({
                    'no-margin no-padding plain-list': true,
                  })}
                >
                  {workTypeFilters.map(workType => {
                    return (
                      <li key={workType.data.id}>
                        <Checkbox
                          id={workType.data.id}
                          text={`${workType.data.label} (${workType.count})`}
                          value={workType.data.id}
                          name={`workType`}
                          checked={
                            workTypeInUrlArray &&
                            workTypeInUrlArray.includes(workType.data.id)
                          }
                          onChange={event => {
                            changeHandler();
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </FilterSection>
            )}
          </FiltersBody>
        </FiltersScrollable>

        <FiltersFooter>
          <NextLink
            passHref
            {...worksUrl({
              ...searchParams,
              workType: null,
              page: 1,
              productionDatesFrom: null,
              productionDatesTo: null,
              itemsLocationsLocationType: null,
            })}
          >
            <a onClick={() => setIsActive(false)}>Reset filters</a>
          </NextLink>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleApplyFilters}
          >
            Apply filters
          </button>
        </FiltersFooter>
      </FiltersModal>
    </div>
  );
};

export default SearchFiltersMobile;
