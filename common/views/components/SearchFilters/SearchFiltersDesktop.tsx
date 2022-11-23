import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { font } from '../../../utils/classnames';
import { useControlledState } from '../../../utils/useControlledState';
import PlainList from '../styled/PlainList';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import dynamic from 'next/dynamic';
import { SearchFiltersSharedProps } from '../SearchFilters/SearchFilters';
import {
  CheckboxFilter as CheckboxFilterType,
  DateRangeFilter as DateRangeFilterType,
  ColorFilter as ColorFilterType,
  filterLabel,
} from '../../../services/catalogue/filters';
import ModalMoreFilters from '../ModalMoreFilters/ModalMoreFilters';
import { ResetActiveFilters } from './ResetActiveFilters';
import ButtonSolid, { ButtonTypes } from '../ButtonSolid/ButtonSolid';
import { filter } from '@weco/common/icons';
import { themeValues } from '@weco/common/views/themes/config';

export const dateRegex = /^\d{4}$|^$/;

const PaletteColorPicker = dynamic(
  import('../PaletteColorPicker/PaletteColorPicker')
);

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
  form?: string;
  newStyle?: boolean;
};

const Wrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top'],
  },
})<{ newStyle?: boolean }>`
  display: flex;
  background-color: ${props =>
    props.newStyle ? 'unset' : props.theme.color('warmNeutral.400')};
`;

const CheckboxFilter = ({
  f,
  changeHandler,
  form,
  newStyle,
}: CheckboxFilterProps) => {
  return (
    <DropdownButton
      isPill={newStyle}
      label={f.label}
      buttonType="inline"
      id={f.id}
    >
      <PlainList className={font('intr', 5)}>
        {f.options.map(({ id, label, value, count, selected }) => {
          return (
            <li key={`${f.id}-${id}`}>
              <CheckboxRadio
                id={id}
                type="checkbox"
                text={filterLabel({ label, count })}
                value={value}
                name={f.id}
                checked={selected}
                onChange={changeHandler}
                form={form}
              />
            </li>
          );
        })}
      </PlainList>
    </DropdownButton>
  );
};

type DateRangeFilterProps = {
  f: DateRangeFilterType;
  changeHandler: () => void;
  form?: string;
  newStyle?: boolean;
};

const DateRangeFilter = ({
  f,
  changeHandler,
  form,
  newStyle,
}: DateRangeFilterProps) => {
  const [from, setFrom] = useControlledState(f.from.value);
  const [to, setTo] = useControlledState(f.to.value);

  return (
    <Space className={font('intr', 5)}>
      <DropdownButton
        isPill={newStyle}
        label={f.label}
        buttonType="inline"
        id={f.id}
      >
        <>
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <NumberInput
              name={f.from.id}
              label="From"
              min="0"
              max="9999"
              placeholder="Year"
              value={from || ''}
              onChange={event => {
                const val = `${event.currentTarget.value}`;
                setFrom(val);
                if (val.match(dateRegex)) {
                  changeHandler();
                }
              }}
              form={form}
            />
          </Space>
          <NumberInput
            name={f.to.id}
            label="to"
            min="0"
            max="9999"
            placeholder="Year"
            value={to || ''}
            onChange={event => {
              const val = `${event.currentTarget.value}`;
              setTo(val);
              if (val.match(dateRegex)) {
                changeHandler();
              }
            }}
            form={form}
          />
        </>
      </DropdownButton>
    </Space>
  );
};

type ColorFilterProps = {
  f: ColorFilterType;
  changeHandler: () => void;
  form?: string;
  newStyle?: boolean;
};
const ColorFilter = ({
  f,
  changeHandler,
  form,
  newStyle,
}: ColorFilterProps) => {
  return (
    <DropdownButton
      isPill={newStyle}
      label="Colours"
      buttonType="inline"
      id="images.color"
    >
      <PaletteColorPicker
        name={f.id}
        color={f.color}
        onChangeColor={changeHandler}
        form={form}
      />
    </DropdownButton>
  );
};

const nVisibleFilters = 3;

const SearchFiltersDesktop: FunctionComponent<SearchFiltersSharedProps> = ({
  query,
  changeHandler,
  filters,
  linkResolver,
  activeFiltersCount,
  searchFormId,
  newStyle,
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);
  const openMoreFiltersButtonRef = useRef(null);

  const [componentMounted, setComponentMounted] = useState(false);
  useEffect(() => setComponentMounted(true), []);

  const visibleFilters = filters.slice(0, nVisibleFilters);
  const modalFilters = filters.slice(nVisibleFilters);

  return (
    <>
      <Wrapper newStyle={newStyle}>
        <Space
          h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          className="flex flex--h-space-between flex--v-center full-width flex--wrap"
        >
          <Space
            v={{ size: 'm', properties: ['margin-bottom'] }}
            className="flex flex--v-center flex--wrap"
          >
            {!newStyle && (
              <Space
                as="span"
                h={{ size: 'm', properties: ['margin-right'] }}
                className="flex flex--v-center"
              >
                <Icon icon={filter} />
                <Space
                  h={{ size: 's', properties: ['margin-left'] }}
                  className={font('intb', 5)}
                >
                  Filter by
                </Space>
              </Space>
            )}

            {visibleFilters.map((f, i, arr) => {
              return (
                <Space
                  key={f.id}
                  h={
                    i + 1 !== arr.length
                      ? {
                          size: newStyle ? 'm' : 's',
                          properties: ['margin-right'],
                        }
                      : undefined
                  }
                >
                  {f.type === 'checkbox' && (
                    <CheckboxFilter
                      f={f}
                      changeHandler={changeHandler}
                      form={searchFormId}
                      newStyle={newStyle}
                    />
                  )}

                  {f.type === 'dateRange' && (
                    <DateRangeFilter
                      f={f}
                      changeHandler={changeHandler}
                      form={searchFormId}
                      newStyle={newStyle}
                    />
                  )}

                  {f.type === 'color' && (
                    <ColorFilter
                      f={f}
                      changeHandler={changeHandler}
                      form={searchFormId}
                      newStyle={newStyle}
                    />
                  )}
                </Space>
              );
            })}

            {modalFilters.length > 0 && (
              <Space
                className={font('intr', 5)}
                h={{ size: newStyle ? 'm' : 's', properties: ['margin-left'] }}
              >
                {componentMounted &&
                  (newStyle ? (
                    <ButtonSolid
                      colors={themeValues.buttonColors.marbleWhiteCharcoal}
                      icon={filter}
                      isIconAfter
                      hoverUnderline={true}
                      size="small"
                      type={ButtonTypes.button}
                      text="All Filters"
                      clickHandler={event => {
                        event.preventDefault();
                        setShowMoreFiltersModal(true);
                      }}
                      ref={openMoreFiltersButtonRef}
                      isPill
                    />
                  ) : (
                    <ButtonSolid
                      colors={themeValues.buttonColors.marbleWhiteCharcoal}
                      hoverUnderline={true}
                      size="small"
                      type={ButtonTypes.button}
                      text="More filters"
                      clickHandler={event => {
                        event.preventDefault();
                        setShowMoreFiltersModal(true);
                      }}
                      ref={openMoreFiltersButtonRef}
                    />
                  ))}
                <ModalMoreFilters
                  query={query}
                  id="moreFilters"
                  isActive={showMoreFiltersModal}
                  setIsActive={setShowMoreFiltersModal}
                  openMoreFiltersButtonRef={openMoreFiltersButtonRef}
                  changeHandler={changeHandler}
                  filters={modalFilters}
                  form={searchFormId}
                />
              </Space>
            )}
          </Space>
        </Space>
      </Wrapper>

      {activeFiltersCount > 0 && (
        <ResetActiveFilters
          query={query}
          linkResolver={linkResolver}
          resetFilters={linkResolver({ query })}
          filters={filters}
        />
      )}
    </>
  );
};

export default SearchFiltersDesktop;
