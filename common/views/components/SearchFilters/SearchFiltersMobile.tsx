import React, {
  useState,
  useRef,
  FunctionComponent,
  ReactElement,
} from 'react';
import useSkipInitialEffect from '@weco/common/hooks/useSkipInitialEffect';
import dynamic from 'next/dynamic';
import getFocusableElements from '../../../utils/get-focusable-elements';
import { useControlledState } from '../../../utils/useControlledState';
import NextLink from 'next/link';
import { toLink as worksLink } from '../WorksLink/WorksLink';
import styled from 'styled-components';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { SearchFiltersSharedProps } from '../SearchFilters/SearchFilters';
import {
  CheckboxFilter as CheckboxFilterType,
  DateRangeFilter as DateRangeFilterType,
  ColorFilter as ColorFilterType,
} from '../../../services/catalogue/filters';
import ButtonSolid, {
  ButtonTypes,
  SolidButton,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { searchFilterCheckBox } from '../../../text/aria-labels';
import { dateRegex } from './SearchFiltersDesktop';
import { filter } from '@weco/common/icons';
import FocusTrap from 'focus-trap-react';
import Modal from '../../components/Modal/Modal';

const PaletteColorPicker = dynamic(
  import('../PaletteColorPicker/PaletteColorPicker')
);

const SearchFiltersContainer = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('white')};
`;

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
})`
  border-bottom: 1px solid ${props => props.theme.color('pumice')};
`;

const ActiveFilters = styled(Space).attrs({
  h: {
    size: 'xs',
    properties: ['margin-left', 'padding-left', 'padding-right'],
  },
  v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  className: 'font-black rounded-corners',
})`
  display: inline-block;
  background-color: ${props => props.theme.color('yellow')};
  text-align: center;
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
})`
  border-bottom: 1px solid ${props => props.theme.color('pumice')};
`;

const FiltersScrollable = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
`;

const FiltersFooter = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  className: 'flex flex--v-center flex--h-space-between',
})`
  background-color: ${props => props.theme.color('white')};
  border-top: 1px solid ${props => props.theme.color('pumice')};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
`;

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
};
const CheckboxFilter = ({ f, changeHandler }: CheckboxFilterProps) => {
  return (
    <>
      <h3 className="h3">{f.label}</h3>
      <ul className={'no-margin no-padding plain-list'}>
        {f.options.map(({ id, label, value, count, selected }) => {
          return (
            <Space
              as="li"
              v={{ size: 'l', properties: ['margin-bottom'] }}
              key={`mobile-${id}`}
            >
              <CheckboxRadio
                id={`mobile-${id}`}
                type="checkbox"
                text={`${label} (${count})`}
                value={value}
                name={f.id}
                checked={selected}
                onChange={changeHandler}
                ariaLabel={searchFilterCheckBox(label)}
              />
            </Space>
          );
        })}
      </ul>
    </>
  );
};

type DateRangeFilterProps = {
  f: DateRangeFilterType;
  changeHandler: () => void;
};
const DateRangeFilter = ({ f, changeHandler }: DateRangeFilterProps) => {
  const [from, setFrom] = useControlledState(f.from.value);
  const [to, setTo] = useControlledState(f.to.value);

  return (
    <>
      <h3 className="h3">{f.label}</h3>
      <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
        <NumberInput
          name={f.from.id}
          label="From"
          min="0"
          max="9999"
          placeholder={'Year'}
          value={from || ''}
          onChange={event => {
            const val = `${event.currentTarget.value}`;
            setFrom(val);
            if (val.match(dateRegex)) {
              changeHandler();
            }
          }}
        />
      </Space>
      <NumberInput
        name={f.to.id}
        label="to"
        min="0"
        max="9999"
        placeholder={'Year'}
        value={to || ''}
        onChange={event => {
          const val = `${event.currentTarget.value}`;
          setTo(val);
          if (val.match(dateRegex)) {
            changeHandler();
          }
        }}
      />
    </>
  );
};

type ColorFilterProps = {
  f: ColorFilterType;
  changeHandler: () => void;
};
const ColorFilter = ({ f, changeHandler }: ColorFilterProps) => {
  return (
    <PaletteColorPicker
      color={f.color}
      name={f.id}
      onChangeColor={changeHandler}
    />
  );
};

const SearchFiltersMobile: FunctionComponent<SearchFiltersSharedProps> = ({
  query,
  changeHandler,
  filters,
  activeFiltersCount,
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const openFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const closeFiltersButtonRef = useRef<HTMLDivElement>(null);
  const okFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const filtersModalRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useSkipInitialEffect(() => {
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
      getFocusableElements<HTMLDivElement>(filtersModalRef.current);

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

  return (
    <SearchFiltersContainer>
      <ShameButtonWrap>
        <SolidButton
          type={ButtonTypes.button}
          ref={openFiltersButtonRef}
          onClick={handleOpenFiltersButtonClick}
          aria-controls="mobile-filters-modal"
          aria-label="open filters"
        >
          <Space h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={filter} />
          </Space>
          Filters{' '}
          {activeFiltersCount > 0 && ' ' && (
            <ActiveFilters>{activeFiltersCount}</ActiveFilters>
          )}
        </SolidButton>
      </ShameButtonWrap>
      <FocusTrap active={isActive}>
        <Modal
          id={'mobile-filters-modal'}
          isActive={isActive}
          setIsActive={setIsActive}
          openButtonRef={openFiltersButtonRef}
          modalStyle={'filters'}
        >
          <FiltersScrollable>
            <FiltersHeader>
              <h2 className="h3 text-align-center block">Filters</h2>
            </FiltersHeader>

            <FiltersBody>
              {filters.map(f => {
                return (
                  <FilterSection key={f.id}>
                    {f.type === 'checkbox' && (
                      <CheckboxFilter f={f} changeHandler={changeHandler} />
                    )}

                    {f.type === 'dateRange' && (
                      <DateRangeFilter f={f} changeHandler={changeHandler} />
                    )}

                    {f.type === 'color' && (
                      <ColorFilter f={f} changeHandler={changeHandler} />
                    )}
                  </FilterSection>
                );
              })}
            </FiltersBody>
          </FiltersScrollable>

          <FiltersFooter>
            <NextLink
              passHref
              {...worksLink(
                {
                  query: query,
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
        </Modal>
      </FocusTrap>
    </SearchFiltersContainer>
  );
};

export default SearchFiltersMobile;
