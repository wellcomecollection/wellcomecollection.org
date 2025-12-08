import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import { chevron } from '@weco/common/icons';
import { classNames, font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

type StyledSelectProps = {
  $isPill?: boolean;
  $darkBg?: boolean;
};

const StyledSelect = styled.div.attrs({
  className: font('sans', -2),
})<StyledSelectProps>`
  position: relative;
  ${({ $isPill }) => $isPill && 'display: inline-block;'}

  .icon {
    position: absolute;
    pointer-events: none;
    ${props =>
      props.$isPill ? 'top: 4px; right: 10px;' : 'top: 6px; right: 6px;'};
  }

  select {
    font-family: inherit;
    font-weight: inherit;
    appearance: none;
    padding: 8px 42px 8px 16px;
    border: ${props => `1px solid
        ${props.theme.color(props.$darkBg ? 'neutral.300' : 'neutral.600')}`};
    border-radius: ${props =>
      props.$isPill ? 20 : props.theme.borderRadiusUnit}px;
    background-color: ${props =>
      props.theme.color(props.$darkBg ? 'black' : 'transparent')};
    color: ${props =>
      props.theme.color(
        props.$darkBg ? 'white' : 'black'
      )}; /* This avoids the default blue links on iOS */
    width: 100%;
    ${props => (props.$isPill ? 'line-height: 1;' : '')}

    option {
      background-color: ${props => props.theme.color('white')};
      color: ${props => props.theme.color('black')};

      /* This allows Windows users to see <Select> dropdown options on a darkBg theme */
    }

    &::-ms-expand {
      display: none;
    }

    &:hover {
      box-shadow: ${props => props.theme.focusBoxShadow};
    }
  }
`;

const SelectLabel = styled.label`
  display: flex;
  align-items: center;
`;

const LabelContent = styled(Space).attrs<{ $hideLabel?: boolean }>(props => ({
  as: 'span',
  className: classNames({
    [font('sans-bold', -1)]: true,
    'visually-hidden': !!props.$hideLabel,
  }),
  $h: { size: '2xs', properties: ['margin-right'] },
}))`
  white-space: nowrap;
`;

type Props = {
  label: string;
  hideLabel?: boolean;
  children: ReactElement<'select'>;
  isPill?: boolean;
  darkBg?: boolean;
};

const SelectContainer: FunctionComponent<Props> = ({
  label,
  hideLabel,
  children,
  isPill,
  darkBg,
}) => {
  return (
    <StyledSelect $isPill={isPill} $darkBg={darkBg}>
      <SelectLabel>
        <LabelContent $hideLabel={hideLabel}>{label}</LabelContent>
        {children}
      </SelectLabel>
      <Icon icon={chevron} />
    </StyledSelect>
  );
};

export default SelectContainer;
