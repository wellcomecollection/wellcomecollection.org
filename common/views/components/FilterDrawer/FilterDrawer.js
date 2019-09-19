// @flow
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';

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

function FilterDrawer() {
  return (
    <>
      <FilterBarUl>
        <FilterBarLi className="is-active">
          <FilterBarAnchor href="#">one</FilterBarAnchor>
        </FilterBarLi>
        <FilterBarLi>
          <FilterBarAnchor href="#">two</FilterBarAnchor>
        </FilterBarLi>
        <FilterBarLi>
          <FilterBarAnchor href="#">three</FilterBarAnchor>
        </FilterBarLi>
      </FilterBarUl>
    </>
  );
}

export default FilterDrawer;
