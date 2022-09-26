import React, { FunctionComponent, RefObject, useContext } from 'react';
import Modal from '../../components/Modal/Modal';
import styled from 'styled-components';
import Space from '../styled/Space';
import { searchFilterCheckBox } from '../../../text/aria-labels';
import NextLink from 'next/link';
import { toLink as worksLink } from '../WorksLink/WorksLink';
import ButtonSolid, { ButtonTypes } from '../ButtonSolid/ButtonSolid';
import {
  Filter,
  CheckboxFilter as CheckboxFilterType,
} from '../../../services/catalogue/filters';
import { AppContext } from '../AppContext/AppContext';
import CheckboxRadio from '../CheckboxRadio/CheckboxRadio';

type ModalMoreFiltersProps = {
  id: string;
  isActive: boolean;
  setIsActive: (arg: boolean) => void;
  openMoreFiltersButtonRef: RefObject<HTMLInputElement>;
  query: string;
  changeHandler: () => void;
  filters: Filter[];
};

type MoreFiltersProps = {
  filters: Filter[];
  changeHandler: () => void;
};

const ModalInner = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-bottom'] },
})`
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
})`
  border-bottom: 1px solid ${props => props.theme.color('pumice')};
`;

const List = styled.ul`
  margin: 0 !important;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  > * {
    flex: 1 1 200px;
  }
`;

const FiltersFooter = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.color('white')};
  border-top: 1px solid ${props => props.theme.color('pumice')};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
`;

const FiltersHeader = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  position: absolute;
  border-bottom: 1px solid ${props => props.theme.color('pumice')};
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
          <Space
            as="li"
            v={{ size: 'm', properties: ['margin-bottom'] }}
            h={{ size: 'l', properties: ['margin-right'] }}
            key={`desktop-${id}`}
          >
            <CheckboxRadio
              id={`desktop-${id}`}
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
    </List>
  );
};

const MoreFilters: FunctionComponent<MoreFiltersProps> = ({
  changeHandler,
  filters,
}: MoreFiltersProps) => {
  return (
    <>
      {filters
        .filter(f => f.excludeFromMoreFilters)
        .map(f => (
          <div key={f.id} style={{ display: 'none' }}>
            {f.type === 'checkbox' && (
              <CheckboxFilter f={f} changeHandler={changeHandler} />
            )}
          </div>
        ))}
      {filters
        .filter(f => !f.excludeFromMoreFilters)
        .map(f => (
          <FilterSection key={f.id}>
            <h3 className="h3">{f.label}</h3>
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <div className="no-margin no-padding plain-list">
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
  query,
  id,
  isActive,
  setIsActive,
  openMoreFiltersButtonRef,
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
        isActive={isActive}
        setIsActive={setIsActive}
        openButtonRef={openMoreFiltersButtonRef}
        modalStyle="filters"
      >
        <FiltersHeader>
          <h3 className="h3">More filters</h3>
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
              setIsActive(false);
            }}
            text="Show results"
          />
        </FiltersFooter>
      </Modal>
    </>
  );
};

export default ModalMoreFilters;
