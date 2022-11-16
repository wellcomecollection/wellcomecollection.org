import { useContext, ReactElement, FunctionComponent } from 'react';
import { chevron } from '@weco/common/icons';
import { AppContext } from '../AppContext/AppContext';
import styled from 'styled-components';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import { classNames, font } from '../../../utils/classnames';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';

type StyledSelectProps = {
  isKeyboard: boolean;
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
    top: 4px;
    right: 6px;
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    font-family: inherit;
    font-weight: inherit;
    appearance: none;
    padding: 8px 42px 8px 16px;
    border: 1px solid ${props => props.theme.color('neutral.600')};
    border-radius: ${props =>
      props.isPill ? 20 : props.theme.borderRadiusUnit}px;
    background-color: ${props =>
      props.theme.color(props.darkBg ? 'white' : 'transparent')};
    width: 100%;

    &::-ms-expand {
      display: none;
    }

    &:hover {
      box-shadow: ${props => props.theme.focusBoxShadow};
    }

    &:focus {
      outline: 0;

      ${props =>
        props.isKeyboard &&
        `
        box-shadow: ${props.theme.focusBoxShadow};
      `}
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
  const { isKeyboard } = useContext(AppContext);
  const isFontsLoaded = useIsFontsLoaded();

  return (
    <StyledSelect
      isKeyboard={isKeyboard}
      isFontsLoaded={isFontsLoaded}
      isPill={isPill}
      darkBg={darkBg}
    >
      <Label>
        <LabelContent hideLabel={hideLabel}>{label}</LabelContent>
        {children}
      </Label>
      <Icon icon={chevron} />
    </StyledSelect>
  );
};

export default SelectContainer;
