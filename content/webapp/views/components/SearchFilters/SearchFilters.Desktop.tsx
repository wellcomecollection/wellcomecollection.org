import { FunctionComponent, ReactElement, useRef, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { partition } from '@weco/common/utils/arrays';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { BooleanFilter as BooleanFilterType } from '@weco/content/services/wellcome/common/filters';

import { SearchFiltersSharedProps } from '.';
import { ResetActiveFilters } from './ResetActiveFilters';
import { BooleanFilter } from './SearchFilters.BooleanFilter';
import DynamicFilterArray from './SearchFilters.Desktop.DynamicFilters';
import ModalMoreFilters from './SearchFilters.Desktop.Modal';

const Wrapper = styled(Space).attrs({
  className: font('sans', -1),
})`
  display: flex;
  align-items: flex-end;
  width: 100%;
  flex-wrap: wrap;
`;

const FilterDropdownsContainer = styled(Space).attrs({
  $v: { size: 'sm', properties: ['margin-bottom'] },
})<{ $isEnhanced?: boolean }>`
  display: flex;
  align-items: center;

  /* Wrap if old style or if new style without Javascript */
  ${props => !props.$isEnhanced && `flex-wrap: wrap;`}
`;

const SearchFiltersDesktop: FunctionComponent<SearchFiltersSharedProps> = ({
  query,
  changeHandler,
  filters,
  linkResolver,
  activeFiltersCount,
  searchFormId,
  hasNoResults,
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const { isEnhanced } = useAppContext();
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const openMoreFiltersButtonRef = useRef(null);

  const [booleanFilters, dropdownFilters] = partition(
    filters,
    (f: BooleanFilterType) => f.type === 'boolean'
  );

  return (
    <>
      <Wrapper
        ref={wrapperRef}
        $h={{ size: 'sm', properties: ['padding-right'] }}
      >
        <FilterDropdownsContainer $isEnhanced={isEnhanced}>
          {isEnhanced && (
            /**
             * I had to extract this component so that useLayoutEffect
             * didn't try to run before it could/cause syncing issues
             */
            <DynamicFilterArray
              showMoreFiltersModal={showMoreFiltersModal}
              setShowMoreFiltersModal={setShowMoreFiltersModal}
              wrapperRef={wrapperRef}
              changeHandler={changeHandler}
              searchFormId={searchFormId}
              filters={dropdownFilters}
              openMoreFiltersButtonRef={openMoreFiltersButtonRef}
              hasNoResults={hasNoResults}
            />
          )}
          <ModalMoreFilters
            {...((showMoreFiltersModal || !isEnhanced) && {
              form: searchFormId,
            })}
            id="moreFilters"
            isActive={showMoreFiltersModal}
            setIsActive={setShowMoreFiltersModal}
            openMoreFiltersButtonRef={openMoreFiltersButtonRef}
            changeHandler={changeHandler}
            resetFilters={linkResolver({ query })}
            filters={filters}
            hasNoResults={hasNoResults}
          />
        </FilterDropdownsContainer>

        {booleanFilters?.map(f => (
          <Space
            key={f.id}
            $v={{ size: 'sm', properties: ['margin-bottom'] }}
            style={{ height: '32px', display: 'flex', alignItems: 'center' }}
          >
            <BooleanFilter
              {...(!showMoreFiltersModal && { form: searchFormId })}
              f={f as BooleanFilterType}
              changeHandler={changeHandler}
            />
          </Space>
        ))}
      </Wrapper>

      {activeFiltersCount > 0 && (
        <ResetActiveFilters
          linkResolver={linkResolver}
          resetFilters={linkResolver({ query })}
          filters={filters}
        />
      )}
    </>
  );
};

export default SearchFiltersDesktop;
