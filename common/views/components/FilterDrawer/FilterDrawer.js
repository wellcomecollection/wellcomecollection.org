// @flow
import { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
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
  transition: background 300ms ease;

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
  .enhanced & {
    transition: height 300ms ease;
    overflow: hidden;
    height: ${props => props.height}px;
  }
`;

const FilterSection = styled.div.attrs(props => ({
  'aria-hidden': !props.isActive,
}))`
  .enhanced & {
    top: 0;
    left: 0;
    transition: opacity 500ms 300ms ease;
    opacity: ${props => (props.isActive ? 1 : 0)};
    position: absolute;
  }
`;

function FilterDrawer() {
  const filtersContainerRef = useRef(null);
  const [activeFilterSection, setActiveFilterSection] = useState(null);
  const [filtersContainerHeight, setFiltersContainerHeight] = useState(0);

  function handleResize() {
    setFiltersContainerHeight(getSectionHeight(activeFilterSection));
  }

  const debounceHandleResize = debounce(handleResize, 500);

  useEffect(() => {
    window.addEventListener('resize', debounceHandleResize);

    return () => {
      window.removeEventListener('resize', debounceHandleResize);
    };
  }, [activeFilterSection]);

  function getSectionHeight(sectionIndex) {
    const el = filtersContainerRef && filtersContainerRef.current;
    const newSection = el && el.children[sectionIndex];

    return (newSection && newSection.getBoundingClientRect().height) || 0;
  }

  function updateFiltersContainerHeight(sectionIndex) {
    const height = getSectionHeight(sectionIndex);

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
          <FilterBarAnchor
            href="#filter-section-0"
            onClick={event => {
              event.preventDefault();
              updateActiveFilterSection(0);
            }}
          >
            one
          </FilterBarAnchor>
        </FilterBarLi>
        <FilterBarLi
          className={classNames({
            'is-active': activeFilterSection === 1,
          })}
        >
          <FilterBarAnchor
            href="#filter-section-1"
            onClick={event => {
              event.preventDefault();
              updateActiveFilterSection(1);
            }}
          >
            two
          </FilterBarAnchor>
        </FilterBarLi>
        <FilterBarLi
          className={classNames({
            'is-active': activeFilterSection === 2,
          })}
        >
          <FilterBarAnchor
            href="#filter-section-2"
            onClick={event => {
              event.preventDefault();
              updateActiveFilterSection(2);
            }}
          >
            three
          </FilterBarAnchor>
        </FilterBarLi>
      </FilterBarUl>
      <FiltersContainer
        ref={filtersContainerRef}
        height={filtersContainerHeight}
      >
        <FilterSection
          id="filter-section-0"
          isActive={activeFilterSection === 0}
        >
          one
        </FilterSection>
        <FilterSection
          id="filter-section-1"
          isActive={activeFilterSection === 1}
        >
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti
            dignissimos optio architecto aut nihil eos nulla, dolores aspernatur
            quis dolorem ad obcaecati ea excepturi earum et est at. Tempora,
            esse.
          </p>
          <p>
            Unde illum soluta expedita laboriosam facilis incidunt sapiente
            molestiae, totam perspiciatis odit, nobis a? Aliquam, illum quae
            dolor tempore mollitia in voluptatibus consequuntur ut dignissimos
            provident dicta voluptates pariatur cumque.
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti
            dignissimos optio architecto aut nihil eos nulla, dolores aspernatur
            quis dolorem ad obcaecati ea excepturi earum et est at. Tempora,
            esse.
          </p>
          <p>
            Unde illum soluta expedita laboriosam facilis incidunt sapiente
            molestiae, totam perspiciatis odit, nobis a? Aliquam, illum quae
            dolor tempore mollitia in voluptatibus consequuntur ut dignissimos
            provident dicta voluptates pariatur cumque.
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti
            dignissimos optio architecto aut nihil eos nulla, dolores aspernatur
            quis dolorem ad obcaecati ea excepturi earum et est at. Tempora,
            esse.
          </p>
          <p>
            Unde illum soluta expedita laboriosam facilis incidunt sapiente
            molestiae, totam perspiciatis odit, nobis a? Aliquam, illum quae
            dolor tempore mollitia in voluptatibus consequuntur ut dignissimos
            provident dicta voluptates pariatur cumque.
          </p>
        </FilterSection>
        <FilterSection
          id="filter-section-2"
          isActive={activeFilterSection === 2}
        >
          three
        </FilterSection>
      </FiltersContainer>
    </FilterDrawerEl>
  );
}

export default FilterDrawer;
