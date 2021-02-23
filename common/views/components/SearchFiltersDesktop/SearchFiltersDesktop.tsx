import React, {
  FunctionComponent,
  ReactElement,
  useContext,
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
import {
  SearchFiltersSharedProps,
  CheckboxFilter as CheckboxFilterType,
  DateRangeFilter as DateRangeFilterType,
  ColorFilter as ColorFilterType,
} from '../SearchFilters/SearchFilters';
import ModalMoreFilters from '../ModalMoreFilters/ModalMoreFilters';
import ButtonInline from '../ButtonInline/ButtonInline';
import { searchFilterCheckBox } from '../../../text/arial-labels';
import { ResetActiveFilters } from '../ResetActiveFilters/ResetActiveFilters';
import TogglesContext from '../TogglesContext/TogglesContext';
import { ButtonTypes } from '../ButtonSolid/ButtonSolid';

const OldColorPicker = dynamic(import('../ColorPicker/ColorPicker'), {
  ssr: false,
});
const PaletteColorPicker = dynamic(
  import('../PaletteColorPicker/PaletteColorPicker')
);

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
};
const CheckboxFilter = ({ f, changeHandler }: CheckboxFilterProps) => {
  return (
    <DropdownButton label={f.label} isInline={true} id={f.id}>
      <ul
        className={classNames({
          'no-margin no-padding plain-list': true,
          [font('hnl', 5)]: true,
        })}
      >
        {f.options.map(({ id, label, value, count, selected }) => {
          return (
            (count > 0 || selected) && (
              <li key={`${f.id}-${id}`}>
                <CheckboxRadio
                  id={id}
                  type={`checkbox`}
                  text={`${label} (${count})`}
                  value={value}
                  name={f.id}
                  checked={selected}
                  onChange={changeHandler}
                  ariaLabel={searchFilterCheckBox(label)}
                />
              </li>
            )
          );
        })}
      </ul>
    </DropdownButton>
  );
};

type DateRangeFilterProps = {
  f: DateRangeFilterType;
  changeHandler: () => void;
};

const DateRangeFilter = ({ f, changeHandler }: DateRangeFilterProps) => {
  const [from, setFrom] = useState(f.from.value);
  const [to, setTo] = useState(f.to.value);

  return (
    <Space
      className={classNames({
        [font('hnl', 5)]: true,
      })}
    >
      <DropdownButton label={f.label} isInline={true} id={f.id}>
        <>
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <NumberInput
              name={f.from.id}
              label="From"
              min="0"
              max="9999"
              placeholder={'Year'}
              value={from || ''}
              onChange={(event) => {
                const val = `${event.currentTarget.value}`;
                setFrom(val);
                if (val.match(/^\d{4}$/)) {
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
            onChange={(event) => {
              const val = `${event.currentTarget.value}`;
              setTo(val);
              if (val.match(/^\d{4}$/)) {
                changeHandler();
              }
            }}
          />
        </>
      </DropdownButton>
    </Space>
  );
};

type ColorFilterProps = {
  f: ColorFilterType;
  changeHandler: () => void;
};
const ColorFilter = ({ f, changeHandler }: ColorFilterProps) => {
  const { paletteColorFilter } = useContext(TogglesContext);
  const ColorPicker = paletteColorFilter ? PaletteColorPicker : OldColorPicker;

  return (
    <DropdownButton label={'Colours'} isInline={true} id="images.color">
      <ColorPicker
        name={f.id}
        color={f.color || undefined}
        onChangeColor={changeHandler}
      />
    </DropdownButton>
  );
};

const SearchFiltersDesktop: FunctionComponent<SearchFiltersSharedProps> = ({
  query,
  changeHandler,
  filters,
  linkResolver,
}: SearchFiltersSharedProps): ReactElement<SearchFiltersSharedProps> => {
  const { searchMoreFilters } = useContext(TogglesContext);

  const [showMoreFiltersModal, setMoreFiltersModal] = useState(false);
  const openMoreFiltersButtonRef = useRef(null);

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
              'flex flex--v-center flex--wrap': true,
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

            {filters.slice(0, 2).map((f, i, arr) => {
              return (
                <Space
                  key={f.id}
                  h={
                    i + 1 !== arr.length
                      ? { size: 's', properties: ['margin-right'] }
                      : undefined
                  }
                >
                  {f.type === 'checkbox' && (
                    <CheckboxFilter f={f} changeHandler={changeHandler} />
                  )}

                  {f.type === 'dateRange' && (
                    <DateRangeFilter f={f} changeHandler={changeHandler} />
                  )}

                  {f.type === 'color' && (
                    <ColorFilter f={f} changeHandler={changeHandler} />
                  )}
                </Space>
              );
            })}

            {searchMoreFilters && filters.slice(2).length > 0 && (
              <Space
                className={classNames({
                  [font('hnl', 5)]: true,
                })}
                h={{ size: 's', properties: ['margin-left'] }}
              >
                <ButtonInline
                  type={ButtonTypes.button}
                  text="More filters"
                  clickHandler={(event) => {
                    event.preventDefault();
                    setMoreFiltersModal(true);
                  }}
                  ref={openMoreFiltersButtonRef}
                />
                <ModalMoreFilters
                  query={query}
                  id="moreFilters"
                  showMoreFiltersModal={showMoreFiltersModal}
                  setMoreFiltersModal={setMoreFiltersModal}
                  openMoreFiltersButtonRef={openMoreFiltersButtonRef}
                  changeHandler={changeHandler}
                  filters={filters.slice(2)}
                />
              </Space>
            )}
          </Space>

          {/*filtersToShow.includes('locations') &&
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
                      .map((locationType) => {
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
                    )*/}
        </Space>
      </Space>

      <ResetActiveFilters
        query={query}
        linkResolver={linkResolver}
        resetFilters={{
          as: { pathname: '???', query: {} },
          href: { pathname: '???', query: {} },
        }}
        filters={filters}
      />
    </>
  );
};

export default SearchFiltersDesktop;
