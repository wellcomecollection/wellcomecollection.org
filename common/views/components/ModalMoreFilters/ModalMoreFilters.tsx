import React, { FunctionComponent, RefObject } from 'react';
import Modal from '../../components/Modal/Modal';
import { font, classNames } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import {
  CatalogueAggregations,
  CatalogueAggregationBucket,
} from '@weco/common/model/catalogue';
import Space from '../styled/Space';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { searchFilterCheckBox } from '../../../text/arial-labels';

type MoreFiltersProps = {
  id: string;
  showMoreFiltersModal: boolean;
  setMoreFiltersModal: (arg: boolean) => void;
  openMoreFiltersButtonRef: RefObject<HTMLInputElement>;
  filtersToShow: string[];
  aggregations: CatalogueAggregations | undefined;
  changeHandler: () => void;
  languagesInUrl: string[];
};

const ModalInner = styled.div`
  ${props => props.theme.media.medium`
    display: flex;
    flex-direction: column;
    height: 60vh;

  `}
`;

const FilterSection = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom', 'padding-bottom'] },
  className: classNames({
    [font('hnl', 5)]: true,
  }),
})``;

const FiltersInner = styled.div`
  ${props => props.theme.media.medium`
    width: 50vw;
    max-width: 500px;
  `}
`;

const LanguagesDropDownContainer = styled.ul.attrs({
  className: classNames({
    'no-margin no-padding plain-list': true,
    [font('hnl', 5)]: true,
  }),
})`
  columns: 1;
`;

const getFilterByCount = (
  bucketFilter: CatalogueAggregationBucket[]
): CatalogueAggregationBucket[] => {
  return bucketFilter.filter(items => {
    return items.count > 0;
  });
};

const ModalMoreFilters: FunctionComponent<MoreFiltersProps> = ({
  id,
  showMoreFiltersModal,
  setMoreFiltersModal,
  openMoreFiltersButtonRef,
  filtersToShow,
  aggregations,
  changeHandler,
  languagesInUrl,
}: MoreFiltersProps) => {
  const languagesFilter: CatalogueAggregationBucket[] =
    aggregations && aggregations?.languages?.buckets
      ? getFilterByCount(aggregations?.languages?.buckets)
      : [];

  return (
    <Modal
      id={id}
      isActive={showMoreFiltersModal}
      setIsActive={setMoreFiltersModal}
      openButtonRef={openMoreFiltersButtonRef}
    >
      <ModalInner>
        <h2
          className={classNames({
            [font('hnm', 5)]: true,
          })}
        >
          More Filters
        </h2>

        {filtersToShow.includes('languages') && (
          <FiltersInner>
            <FilterSection>
              <Space h={{ size: 's', properties: ['margin-bottom'] }}>
                <DropdownButton
                  label={'Languages'}
                  isInline={true}
                  id="languages"
                >
                  <LanguagesDropDownContainer>
                    {languagesFilter.map(language => {
                      const isChecked = languagesInUrl.includes(
                        language.data.id
                      );

                      return (
                        languagesFilter.length && (
                          <li key={language.data.id}>
                            <CheckboxRadio
                              id={language.data.id}
                              type={`checkbox`}
                              text={`${language.data.label} (${language.count})`}
                              value={language.data.id}
                              name={`languageOptions`}
                              checked={isChecked}
                              onChange={changeHandler}
                              ariaLabel={searchFilterCheckBox(
                                language.data.label
                              )}
                            />
                          </li>
                        )
                      );
                    })}
                  </LanguagesDropDownContainer>
                </DropdownButton>
              </Space>
            </FilterSection>
          </FiltersInner>
        )}
      </ModalInner>
    </Modal>
  );
};

export default ModalMoreFilters;
