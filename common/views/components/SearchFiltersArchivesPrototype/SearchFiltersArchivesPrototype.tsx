import { useState, useContext } from 'react';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { worksLink } from '../../../services/catalogue/routes';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import NumberInput from '@weco/common/views/components/NumberInput/NumberInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import Modal from '@weco/common/views/components/Modal/Modal';
import TogglesContext from '../TogglesContext/TogglesContext';
import ButtonSolid, {
  SolidButton,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';

// $FlowFixMe (tsx)
const ColorPicker = dynamic(import('../ColorPicker/ColorPicker'), {
  ssr: false,
});

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

const FilterSection = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom', 'padding-bottom'] },
  className: classNames({
    [font('hnl', 5)]: true,
  }),
})``;

const FilterFooter = styled.div.attrs({
  className: classNames({
    'flex flex--h-space-between': true,
  }),
})`
  align-items: flex-end;
  position: sticky;
  bottom: 0;
  background: white;

  &:before,
  &:after {
    content: '';
    position: absolute;
    left: -46px;
    right: -46px;
  }

  &:before {
    background: linear-gradient(to top, white, rgba(255, 255, 255, 0));
    height: 20px;
    top: -20px;
  }

  &:after {
    background: white;
    bottom: -46px;
    height: 46px;
  }
`;

const FiltersInner = styled.div`
  ${props => props.theme.media.medium`
    width: 50vw;
    max-width: 500px;
  `}
`;

const SearchFiltersArchivesPrototype = ({
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
  imagesColor,
}: SearchFiltersSharedProps) => {
  const [isActive, setIsActive] = useState(false);

  function handleOkFiltersButtonClick() {
    setIsActive(false);
  }

  function handleOpenFiltersButtonClick() {
    setIsActive(true);
  }

  const showWorkTypeFilters =
    workTypeFilters.some(f => f.count > 0) || workTypeInUrlArray.length > 0;

  const { enableColorFiltering } = useContext(TogglesContext);
  const showColorFilter =
    enableColorFiltering && worksRouteProps.search === 'images';

  const activeFiltersCount =
    workTypeInUrlArray.length +
    (productionDatesFrom ? 1 : 0) +
    (productionDatesTo ? 1 : 0);

  return (
    <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
      <SolidButton
        onClick={handleOpenFiltersButtonClick}
        aria-controls="archives-prototype-filters"
        aria-label="open filters"
        type="button"
      >
        <Space h={{ size: 's', properties: ['margin-right'] }}>
          <Icon name="filter" />
        </Space>
        Filters{' '}
        {activeFiltersCount > 0 && ' ' && (
          <ActiveFilters>{activeFiltersCount}</ActiveFilters>
        )}
      </SolidButton>
      <Modal
        isActive={isActive}
        setIsActive={setIsActive}
        id="archives-prototype-filters"
      >
        <FiltersInner>
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
                        v={{ size: 's', properties: ['margin-bottom'] }}
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
          {showColorFilter && (
            <FilterSection>
              <h3 className="h3">Colour</h3>
              <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
                <ColorPicker
                  name="images.color"
                  color={imagesColor}
                  onChangeColor={changeHandler}
                />
              </Space>
            </FilterSection>
          )}
        </FiltersInner>
        <FilterFooter>
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
            type="button"
            clickHandler={handleOkFiltersButtonClick}
            text="OK"
          />
        </FilterFooter>
      </Modal>
    </Space>
  );
};

export default SearchFiltersArchivesPrototype;
