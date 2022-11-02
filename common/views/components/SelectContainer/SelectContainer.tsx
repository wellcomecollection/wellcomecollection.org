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
};

const StyledSelect = styled.div.attrs({
  className: font('intr', 5),
})<StyledSelectProps>`
  position: relative;

  .icon {
    position: absolute;
    pointer-events: none;
    top: 6px;
    right: 6px;
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    font-family: inherit;
    font-weight: inherit;
    appearance: none;
    padding: 6px 36px 6px 12px;
    border: 2px solid ${props => props.theme.color('warmNeutral.400')};
    border-radius: ${props =>
      props.isPill ? 20 : props.theme.borderRadiusUnit}px;
    background-color: ${props => props.theme.color('white')};
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

type Props = {
  label: string;
  hideLabel?: boolean;
  children: ReactElement<'select'>;
  isPill?: boolean;
};

const SelectContainer: FunctionComponent<Props> = ({
  label,
  hideLabel,
  children,
  isPill,
}) => {
  const { isKeyboard } = useContext(AppContext);
  const isFontsLoaded = useIsFontsLoaded();

  return (
    <StyledSelect
      isKeyboard={isKeyboard}
      isFontsLoaded={isFontsLoaded}
      isPill={isPill}
    >
      <label className="flex flex--v-center">
        <Space
          as="span"
          h={{ size: 's', properties: ['margin-right'] }}
          style={{ whiteSpace: 'nowrap' }}
          className={classNames({
            [font('intb', 5)]: true,
            'visually-hidden': !!hideLabel,
          })}
        >
          {label}
        </Space>
        {children}
      </label>
      <Icon icon={chevron} />
    </StyledSelect>
  );
};

export default SelectContainer;
