import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { toHtmlId } from '@weco/common/utils/grammar';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import AnimatedUnderlineCSS, {
  AnimatedUnderlineProps,
} from '@weco/common/views/components/styled/AnimatedUnderline';
import { focusStyle } from '@weco/common/views/themes/base/wellcome-normalize';

type SelectableTagsProps = {
  tags: {
    id: string;
    label: string;
    controls?: string;
    gtmData?: DataGtmProps;
  }[];
  isMultiSelect?: boolean;
  onChange?: (selected: string[]) => void;
};

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;

  ${props => props.theme.media('medium')`
    column-gap: 16px;
  `}
`;

const StyledInput = styled.label<
  AnimatedUnderlineProps & { $isSelected: boolean }
>`
  ${AnimatedUnderlineCSS}

  display: inline-block;
  border: 1px solid ${props => props.theme.color('black')};
  background-color: ${props =>
    props.theme.color(props.$isSelected ? 'neutral.700' : 'transparent')};
  color: ${props => props.theme.color(props.$isSelected ? 'white' : 'black')};
  padding: 8px 16px;
  border-radius: 100px;
  cursor: pointer;

  &:hover {
    background-color: ${props =>
      props.theme.color(props.$isSelected ? 'neutral.700' : 'warmNeutral.400')};
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
    ${focusStyle};
  }

  &:focus ~ ${StyledInput}:not(:focus-visible ~ ${StyledInput}),
  &:active ~ ${StyledInput} {
    box-shadow: none;
  }
`;

export const SelectableTags: FunctionComponent<SelectableTagsProps> = ({
  tags,
  isMultiSelect,
  onChange,
}) => {
  const [selected, setSelected] = useState<string[]>([tags[0]?.id]);

  useEffect(() => {
    setSelected([tags[0]?.id]);
  }, [isMultiSelect]);

  if (tags.length === 0) return null;

  const isLastSelected = (id: string) =>
    isMultiSelect && selected.length === 1 && selected[0] === id;

  const handleTagClick = (id: string) => {
    const isSelected = selected.includes(id);

    let newSelected: string[];
    // Single-select mode: always select only the clicked tag
    if (!isMultiSelect) {
      newSelected = [id];
    } else if (isSelected) {
      // If it's the last selected tag, don't allow unselecting (must always have one selected)
      newSelected = isLastSelected(id)
        ? [id]
        : // Otherwise, remove the tag from the selection
          selected.filter(tagId => tagId !== id);
    } else {
      // Multi-select mode: tag is not selected, so add it to the selection
      newSelected = [...selected, id];
    }

    setSelected(newSelected);

    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <div data-component="selectable-tags">
      <TagsWrapper className={font('sans-bold', -1)}>
        {tags.map((tag, index) => {
          const isSelected = selected.includes(tag.id);
          const gtmAttributes = dataGtmPropsToAttributes({
            'position-in-list': String(index + 1),
            ...tag.gtmData,
          });

          return (
            <div key={tag.id}>
              {isMultiSelect ? (
                <InputField
                  id={toHtmlId(tag.id)}
                  type="checkbox"
                  value={tag.id}
                  checked={isSelected}
                  onChange={() => handleTagClick(tag.id)}
                  {...gtmAttributes}
                  {...(tag.controls && { 'aria-controls': tag.controls })}
                />
              ) : (
                <InputField
                  id={toHtmlId(tag.id)}
                  type="radio"
                  name="selectable-tags"
                  value={tag.id}
                  checked={isSelected}
                  onChange={() => handleTagClick(tag.id)}
                  {...gtmAttributes}
                  {...(tag.controls && { 'aria-controls': tag.controls })}
                />
              )}
              <StyledInput
                as="label"
                key={tag.id}
                htmlFor={toHtmlId(tag.id)}
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
