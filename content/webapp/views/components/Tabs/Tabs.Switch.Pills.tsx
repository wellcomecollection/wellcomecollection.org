import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import {
  SolidButtonStyledProps,
  StyledButtonCSS,
} from '@weco/common/views/components/Buttons';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';

import { IconWrapper, NavItemShim } from './Tabs.styles';
import { SwitchSelectableTextLink } from './Tabs.Switch';

const PillButton = styled.span<SolidButtonStyledProps>`
  display: block;
  cursor: pointer;
  ${StyledButtonCSS}
`;

type Props = {
  item: SwitchSelectableTextLink;
  isSelected: boolean;
};

const InnerPillButton: FunctionComponent<Props> = ({
  item,
  isSelected,
  ...gtmData
}: Props) => {
  const { isEnhanced } = useAppContext();

  return (
    <PillButton
      $isPill
      $colors={
        isSelected
          ? themeValues.buttonColors.blackCharcoalWhite
          : themeValues.buttonColors.charcoalTransparentCharcoal
      }
      {...gtmData}
    >
      <NavItemShim>{item.text}</NavItemShim>
      <ConditionalWrapper
        condition={Boolean(item.url && !isEnhanced)}
        wrapper={children => <a href={item.url}>{children}</a>}
      >
        {item.icon && (
          <Space as="span" $h={{ size: 's', properties: ['margin-right'] }}>
            <IconWrapper>
              <Icon icon={item.icon} />
            </IconWrapper>
          </Space>
        )}
        {item.text}
      </ConditionalWrapper>
    </PillButton>
  );
};

export default InnerPillButton;
