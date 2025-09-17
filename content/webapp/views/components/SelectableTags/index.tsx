// TODO:
// make hover line reusable
// keyboard nav for multi select
// aria-live on content change
// Consider NO JS
// Submit button required????? We don't have on in filters on desktop.

import { useState } from 'react';
import styled from 'styled-components';

type Tag = {
  id: string;
  label: string;
};

type SelectableTagsProps = {
  tags: Tag[];
  isMultiSelect?: boolean;
  onChange?: (selectedIds: string[]) => void;
};

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
`;

const StyledInput = styled.label<{ $isSelected: boolean }>`
  --line-color: ${props =>
    props.theme.color(props.$isSelected ? 'white' : 'black')};
  position: relative;

  display: inline-block;
  border: 1px solid ${props => props.theme.color('black')};
  background-color: ${props =>
    props.theme.color(props.$isSelected ? 'black' : 'transparent')};
  color: ${props => props.theme.color(props.$isSelected ? 'white' : 'black')};
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;

  &:focus-visible,
  &:focus,
  &:target,
  &:active {
    box-shadow: ${props => props.theme.focusBoxShadow};
    outline: ${props => props.theme.highContrastOutlineFix};
  }

  & > span {
    background-image: linear-gradient(
      0deg,
      var(--line-color) 0%,
      var(--line-color) 100%
    );
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: var(--background-size, 0%) 1.4px;
    transition: background-size ${props => props.theme.transitionProperties};
    line-height: 20px;
    transform: translateZ(0);
    padding-bottom: 2px;
  }

  &:hover {
    background-color: ${props =>
      props.theme.color(props.$isSelected ? 'black' : 'warmNeutral.400')};
    color: ${props => props.theme.color(props.$isSelected ? 'white' : 'black')};

    --background-size: 100%;
  }

  input {
    position: absolute;
    opacity: 0;
    z-index: 1;
  }
`;

export const SelectableTags: React.FC<SelectableTagsProps> = ({
  tags,
  isMultiSelect,
  onChange,
}) => {
  const [selected, setSelected] = useState<string[]>([tags[0]?.id]);

  if (tags.length === 0) return null;

  // In a multi-choice, the last one selected cannot be unselected
  // (there must always be at least one selected)
  const isLastSelected = (id: string) =>
    isMultiSelect && selected.length === 1 && selected[0] === id;

  const handleTagClick = (id: string) => {
    if (isMultiSelect) {
      const isSelected = selected.includes(id);
      const newSelected = isSelected
        ? isLastSelected(id)
          ? [id]
          : selected.filter(tagId => tagId !== id)
        : [...selected, id];

      setSelected(newSelected);

      if (onChange) {
        onChange(newSelected);
      }
    } else {
      setSelected([id]);
    }
  };

  return (
    <div data-component="selectable-tags">
      <TagsWrapper>
        {tags.map(tag => (
          <StyledInput
            key={tag.id}
            htmlFor={tag.id}
            $isSelected={selected.includes(tag.id)}
          >
            {isMultiSelect ? (
              <input
                id={tag.id}
                type="checkbox"
                value={tag.id}
                checked={selected.includes(tag.id)}
                onChange={() => handleTagClick(tag.id)}
              />
            ) : (
              <input
                id={tag.id}
                type="radio"
                name="selectable-tags"
                value={tag.id}
                checked={selected.includes(tag.id)}
                onChange={() => handleTagClick(tag.id)}
              />
            )}

            <span>{tag.label}</span>
          </StyledInput>
        ))}
      </TagsWrapper>
    </div>
  );
};

export default SelectableTags;
