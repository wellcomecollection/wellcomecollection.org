import React, {
  FunctionComponent,
  ReactElement,
  useRef,
  useState,
  useContext,
} from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { SearchFiltersSharedProps } from '.';

import ModalMoreFilters from '../ModalMoreFilters';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

import { ResetActiveFilters } from './ResetActiveFilters';
import DynamicFilterArray from './SearchFilters.Desktop.DynamicFilters';

const Wrapper = styled(Space)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
`;

const FilterDropdownsContainer = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 'm', properties: ['margin-bottom'] },
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
  const { isEnhanced } = useContext(AppContext);
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const openMoreFiltersButtonRef = useRef(null);

  return (
    <>
      <Wrapper
        ref={wrapperRef}
        $h={{ size: 'm', properties: ['padding-right'] }}
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
              filters={filters}
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
