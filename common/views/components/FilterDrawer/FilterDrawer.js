// @flow
import { useState, useRef, useEffect, type Node } from 'react';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';

const FilterDrawerEl = styled.div.attrs({
  className: classNames({
    FilterDrawerEl: true,
    [font('hnl', 5)]: true,
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
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
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
    transition-delay: 300ms;
    overflow: hidden;
    height: ${props => props.height}px;
  }
`;

const FilterSection = styled.fieldset.attrs(props => ({
  disabled: !props.isActive,
  'aria-hidden': !props.isActive,
}))`
  .enhanced & {
    top: 0;
    left: 0;
    transition: opacity 300ms ease;
    transition-delay: ${props => (!props.isActive ? '0ms' : '500ms')};
    opacity: ${props => (props.isActive ? 1 : 0)};
    position: absolute;
    pointer-events: ${props => (props.isActive ? 'all' : 'none')};
  }
`;

type Props = {|
  items: {| title: string, component: Node |}[],
|};

function FilterDrawer({ items }: Props) {
  const filtersContainerRef = useRef(null);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState(null);
  const [filtersContainerHeight, setFiltersContainerHeight] = useState(0);

  function handleResize() {
    setFiltersContainerHeight(getSectionHeight(activeFilterSection));
  }

  const debounceHandleResize = debounce(handleResize, 500);

  useEffect(() => {
    setIsEnhanced(true);
  }, []);
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
      <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
        <h2 className="inline">Filter by</h2>
      </Space>
      <FilterBarUl>
        {items.map((item, index) => (
          <FilterBarLi
            key={item.title}
            className={classNames({
              'is-active': activeFilterSection === index,
            })}
          >
            <FilterBarAnchor
              href={`#filter-section-${index}`}
              onClick={event => {
                event.preventDefault();
                updateActiveFilterSection(index);
              }}
            >
              {item.title}
            </FilterBarAnchor>
          </FilterBarLi>
        ))}
      </FilterBarUl>
      <FiltersContainer
        ref={filtersContainerRef}
        height={filtersContainerHeight}
      >
        {items.map((item, index) => (
          <FilterSection
            key={item.title}
            id={`filter-section-${index}`}
            isActive={isEnhanced ? activeFilterSection === index : true}
          >
            {item.component}
          </FilterSection>
        ))}
      </FiltersContainer>
    </FilterDrawerEl>
  );
}

export default FilterDrawer;
