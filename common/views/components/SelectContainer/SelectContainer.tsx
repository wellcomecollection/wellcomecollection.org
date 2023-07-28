import { ReactElement, FunctionComponent } from 'react';
import { chevron } from '@weco/common/icons';
import styled from 'styled-components';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import { classNames, font } from '../../../utils/classnames';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';

type StyledSelectProps = {
  isFontsLoaded: boolean;
  isPill?: boolean;
  darkBg?: boolean;
};

const StyledSelect = styled.div.attrs({
  className: font('intr', 6),
})<StyledSelectProps>`
  position: relative;
  ${({ isPill }) => isPill && 'display: inline-block;'}

  .icon {
    position: absolute;
    pointer-events: none;
    ${props =>
      props.isPill ? 'top: 4px; right: 10px;' : 'top: 6px; right: 6px;'};
  }

  select {
    font-family: inherit;
    font-weight: inherit;
    appearance: none;
    padding: 8px 42px 8px 16px;
    border: ${props => `1px solid 
        ${props.theme.color(props.darkBg ? 'neutral.300' : 'neutral.600')}`};
    border-radius: ${props =>
      props.isPill ? 20 : props.theme.borderRadiusUnit}px;
    background-color: ${props =>
      props.theme.color(props.darkBg ? 'black' : 'transparent')};
    color: ${props =>
      props.theme.color(
        props.darkBg ? 'white' : 'black'
      )}; /* This avoids the default blue links on iOS */
    width: 100%;
    ${props => (props.isPill ? 'line-height: 1;' : '')}

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

    &:focus-visible,
    &:focus {
      box-shadow: ${props => props.theme.focusBoxShadow};
      outline: 0;
    }

    :focus:not(:focus-visible) {
      box-shadow: none;
    }
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
`;

const LabelContent = styled(Space).attrs<{ hideLabel?: boolean }>(props => ({
  as: 'span',
  h: { size: 's', properties: ['margin-right'] },
  className: classNames({
    [font('intb', 5)]: true,
    'visually-hidden': !!props.hideLabel,
  }),
}))<{ hideLabel?: boolean }>`
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
  const isFontsLoaded = useIsFontsLoaded();

  return (
    <StyledSelect isFontsLoaded={isFontsLoaded} isPill={isPill} darkBg={darkBg}>
      <Label>
        <LabelContent hideLabel={hideLabel}>{label}</LabelContent>
        {children}
      </Label>
      <Icon icon={chevron} />
    </StyledSelect>
  );
};

export default SelectContainer;
