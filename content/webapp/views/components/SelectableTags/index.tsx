// TODO:
// make hover line reusable
// aria-live on content change
// Consider NO JS
// Submit button required????? We don't have on in filters on desktop.

import { useEffect, useState } from 'react';
import styled from 'styled-components';

import AnimatedUnderlineCSS, {
  AnimatedUnderlineProps,
} from '@weco/common/views/components/styled/AnimatedUnderline';

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

const StyledInput = styled.label<
  AnimatedUnderlineProps & {
    $isSelected: boolean;
  }
>`
  ${AnimatedUnderlineCSS}

  display: inline-block;
  border: 1px solid ${props => props.theme.color('black')};
  background-color: ${props =>
    props.theme.color(props.$isSelected ? 'black' : 'transparent')};
  color: ${props => props.theme.color(props.$isSelected ? 'white' : 'black')};
  padding: 8px 16px;
  border-radius: 100px;
  cursor: pointer;

  &:hover {
    background-color: ${props =>
      props.theme.color(props.$isSelected ? 'black' : 'warmNeutral.400')};
    color: ${props => props.theme.color(props.$isSelected ? 'white' : 'black')};
  }
`;

const InputField = styled.input`
  position: absolute;
  opacity: 0;
  z-index: 1;
  height: 0;
  width: 0;

  &:focus-visible ~ ${StyledInput}, &:focus ~ ${StyledInput} {
    box-shadow: ${props => props.theme.focusBoxShadow};
    outline: ${props => props.theme.highContrastOutlineFix};
  }

  &:focus ~ ${StyledInput}:not(:focus-visible ~ ${StyledInput}) {
    box-shadow: none;
  }
`;

export const SelectableTags: React.FC<SelectableTagsProps> = ({
  tags,
  isMultiSelect,
  onChange,
}) => {
  const [selected, setSelected] = useState<string[]>([tags[0]?.id]);

  useEffect(() => {
    setSelected([tags[0]?.id]);
  }, [isMultiSelect]);

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
        {tags.map(tag => {
          const isSelected = selected.includes(tag.id);
          return (
            <div key={tag.id}>
              {isMultiSelect ? (
                <InputField
                  id={tag.id}
                  type="checkbox"
                  value={tag.id}
                  checked={isSelected}
                  onChange={() => handleTagClick(tag.id)}
                />
              ) : (
                <InputField
                  id={tag.id}
                  type="radio"
                  name="selectable-tags"
                  value={tag.id}
                  checked={isSelected}
                  onChange={() => handleTagClick(tag.id)}
                />
              )}
              <StyledInput
                as="label"
                key={tag.id}
                htmlFor={tag.id}
                $isSelected={!!isSelected}
                $lineColor={isSelected ? 'white' : 'black'}
                $lineThickness={1.4}
              >
                <span>{tag.label}</span>
              </StyledInput>
            </div>
          );
        })}
      </TagsWrapper>
    </div>
  );
};

export default SelectableTags;
