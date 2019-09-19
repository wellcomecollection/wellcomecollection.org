// @flow
import { useState, useRef } from 'react';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';

const FilterDrawerEl = styled.div.attrs({
  className: classNames({
    FilterDrawerEl: true,
  }),
})``;

const FilterBarUl = styled.ul.attrs({
  className: classNames({
    'bg-cream plain-list no-margin no-padding flex-inline': true,
  }),
})``;

const FilterBarLi = styled.li.attrs({
  className: classNames({
    FilterBarLi: true,
    relative: true,
  }),
})`
  &:after {
    content: '';
    position: absolute;
    right: -1px;
    bottom: 3px;
    top: 3px;
    width: 1px;
    background: ${props => props.theme.colors.pumice};
  }

  &.is-active:after,
  &:hover:after,
  &:last-child:after {
    display: none;
  }
`;

const FilterBarAnchor = styled(Space).attrs({
  as: 'a',
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'inline-block font-pewter border-bottom-width-3 border-color-transparent': true,
  }),
})`
  text-decoration: none;
  transition: background 250ms ease;

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.6);
  }

  .FilterBarLi.is-active & {
    background: rgba(255, 255, 255, 0.6);
    border-bottom-color: ${props => props.theme.colors.yellow};
    color: ${props => props.theme.colors.black};
  }
`;

const FiltersContainer = styled.div.attrs({
  className: classNames({
    relative: true,
  }),
})`
  transition: height 250ms ease;
  overflow: hidden;
  height: ${props => props.height}px;
`;

const FilterSection = styled.div.attrs(props => ({
  className: classNames({
    absolute: true,
  }),
  // hidden: !props.isActive,
}))`
  top: 0;
  left: 0;
  transition: opacity 250ms ease;
  opacity: ${props => (props.isActive ? 1 : 0)};
`;

function FilterDrawer() {
  const filtersContainerRef = useRef(null);
  const [activeFilterSection, setActiveFilterSection] = useState(null);
  const [filtersContainerHeight, setFiltersContainerHeight] = useState(0);

  function updateFiltersContainerHeight(sectionIndex) {
    const el = filtersContainerRef && filtersContainerRef.current;
    const newSection = el && el.children[sectionIndex];
    const height = newSection && newSection.getBoundingClientRect().height;

    setFiltersContainerHeight(
      activeFilterSection === sectionIndex ? 0 : height
    );
  }

  function updateActiveFilterSection(sectionIndex) {
    updateFiltersContainerHeight(sectionIndex);

    setActiveFilterSection(
      activeFilterSection === sectionIndex ? null : sectionIndex
    );
  }

  return (
    <FilterDrawerEl
      className={classNames({
        'is-open': activeFilterSection !== null,
      })}
    >
      <FilterBarUl>
        <FilterBarLi
          className={classNames({
            'is-active': activeFilterSection === 0,
          })}
        >
          <FilterBarAnchor onClick={() => updateActiveFilterSection(0)}>
            one
          </FilterBarAnchor>
        </FilterBarLi>
        <FilterBarLi
          className={classNames({
            'is-active': activeFilterSection === 1,
          })}
        >
          <FilterBarAnchor onClick={() => updateActiveFilterSection(1)}>
            two
          </FilterBarAnchor>
        </FilterBarLi>
        <FilterBarLi
          className={classNames({
            'is-active': activeFilterSection === 2,
          })}
        >
          <FilterBarAnchor onClick={() => updateActiveFilterSection(2)}>
            three
          </FilterBarAnchor>
        </FilterBarLi>
      </FilterBarUl>
      <FiltersContainer
        ref={filtersContainerRef}
        height={filtersContainerHeight}
      >
        <FilterSection isActive={activeFilterSection === 0}>one</FilterSection>
        <FilterSection isActive={activeFilterSection === 1}>two</FilterSection>
        <FilterSection isActive={activeFilterSection === 2}>
          three
        </FilterSection>
      </FiltersContainer>
    </FilterDrawerEl>
  );
}

export default FilterDrawer;
