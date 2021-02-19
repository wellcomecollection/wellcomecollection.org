import React, { FunctionComponent, RefObject, useContext } from 'react';
import Modal from '../../components/Modal/Modal';
import { classNames } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Space from '../styled/Space';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { searchFilterCheckBox } from '../../../text/arial-labels';
import NextLink from 'next/link';
import { worksLink } from '../../../services/catalogue/routes';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import {
  Filter,
  CheckboxFilter as CheckboxFilterType,
} from '../SearchFilters/SearchFilters';
import { AppContext } from '../AppContext/AppContext';

type ModalMoreFiltersProps = {
  id: string;
  showMoreFiltersModal: boolean;
  setMoreFiltersModal: (arg: boolean) => void;
  openMoreFiltersButtonRef: RefObject<HTMLInputElement>;
  query: string;
  changeHandler: () => void;
  filters: Filter[];
};

type MoreFiltersProps = {
  filters: Filter[];
  changeHandler: () => void;
};

const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  max-width: 650px;
  ${props => props.theme.media.large`
    width: 650px;
    top: 10px;
  `}
  position: relative;
  top: 15px;
  overflow-y: auto;
  max-height: 80vh;
`;

// shared styles
const FilterSection = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'border-bottom-width-1 border-color-pumice': true,
  }),
})``;

const List = styled.ul.attrs({
  className: classNames({
    'no-margin no-padding plain-list': true,
  }),
})`
  display: flex;
  flex-wrap: wrap;
  > * {
    flex: 1 1 200px;
  }
`;

const FiltersFooter = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
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

const FiltersHeader = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'border-color-pumice border-bottom-width-1 absolute': true,
  }),
})`
  text-align: center;
  top: 0px;
  left: 0px;
  width: 100%;
`;

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
};
const CheckboxFilter = ({ f, changeHandler }: CheckboxFilterProps) => {
  return (
    <List>
      {f.options.map(({ id, label, value, count, selected }) => {
        return (
          (count > 0 || selected) && (
            <Space
              as="li"
              v={{ size: 'm', properties: ['margin-bottom'] }}
              h={{ size: 'l', properties: ['margin-right'] }}
              key={`desktop-${id}`}
            >
              <CheckboxRadio
                id={`desktop-${id}`}
                type={`checkbox`}
                text={`${label} (${count})`}
                value={value}
                name={f.id}
                checked={selected}
                onChange={changeHandler}
                ariaLabel={searchFilterCheckBox(label)}
              />
            </Space>
          )
        );
      })}
    </List>
  );
};

const MoreFilters: FunctionComponent<MoreFiltersProps> = ({
  changeHandler,
  filters,
}: MoreFiltersProps) => {
  return (
    <>
      {filters.map(f => (
        <FilterSection key={f.id}>
          <h3 className="h3">{f.label}</h3>
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <div
              className={classNames({
                'no-margin no-padding plain-list': true,
              })}
            >
              {f.type === 'checkbox' && (
                <CheckboxFilter f={f} changeHandler={changeHandler} />
              )}
            </div>
          </Space>
        </FilterSection>
      ))}
    </>
  );
};

const ModalMoreFilters: FunctionComponent<ModalMoreFiltersProps> = ({
  id,
  showMoreFiltersModal,
  setMoreFiltersModal,
  openMoreFiltersButtonRef,
  query,
  changeHandler,
  filters,
}: ModalMoreFiltersProps) => {
  const { isEnhanced } = useContext(AppContext);
  return (
    <>
      <noscript>
        <>
          <MoreFilters changeHandler={changeHandler} filters={filters} />
        </>
      </noscript>
      <Modal
        id={id}
        isActive={showMoreFiltersModal}
        setIsActive={setMoreFiltersModal}
        openButtonRef={openMoreFiltersButtonRef}
        overrideDefaultModalStyle={true}
      >
        <FiltersHeader>
          <h3 className="h3">More Filters</h3>
        </FiltersHeader>

        <ModalInner>
          {isEnhanced && (
            <MoreFilters changeHandler={changeHandler} filters={filters} />
          )}
        </ModalInner>
        <FiltersFooter>
          <NextLink
            passHref
            {...worksLink(
              {
                query,
              },
              'cancel_filter/all'
            )}
          >
            <a>Reset filters</a>
          </NextLink>

          <ButtonSolid
            ref={undefined}
            type={ButtonTypes.button}
            clickHandler={() => {
              setMoreFiltersModal(false);
            }}
            text="Show results"
          />
        </FiltersFooter>
      </Modal>
    </>
  );
};

export default ModalMoreFilters;
