import { useContext, ReactElement, FC } from 'react';
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
};

const StyledSelect = styled.div.attrs({
  className: classNames({
    [font('hnr', 5)]: true,
  }),
})<StyledSelectProps>`
  position: relative;

  .icon {
    pointer-events: none;
    top: 6px;
    right: 36px;
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    font-family: inherit;
    font-weight: inherit;
    appearance: none;
    padding: 7px 36px 9px 12px;
    border: 2px solid ${props => props.theme.color('pumice')};
    border-radius: ${props => props.theme.borderRadiusUnit}px;
    background-color: ${props => props.theme.color('white')};

    // TODO: Remove this if/when we stop using Helvetica World
    ${props =>
      props.isFontsLoaded &&
      `
      padding: 4px 30px 8px 12px;
      line-height: 1.5;
    `}

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
};

const SelectContainer: FC<Props> = ({ label, hideLabel, children }) => {
  const { isKeyboard } = useContext(AppContext);
  const isFontsLoaded = useIsFontsLoaded();

  return (
    <StyledSelect isKeyboard={isKeyboard} isFontsLoaded={isFontsLoaded}>
      <label>
        <Space
          as="span"
          h={{ size: 's', properties: ['margin-right'] }}
          className={classNames({
            [font('hnb', 5)]: true,
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
