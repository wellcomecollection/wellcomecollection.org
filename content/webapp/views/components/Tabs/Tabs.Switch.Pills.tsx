import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { toSnakeCase } from '@weco/common/utils/grammar';
import Buttons from '@weco/common/views/components/Buttons';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

import { IconWrapper, NavItemShim } from './Tabs.styles';
import { SwitchSelectableTextLink } from './Tabs.Switch';

const PillButton = styled(Buttons).attrs<{ $selected: boolean }>(props => ({
  colors: props.$selected
    ? props.theme.buttonColors.charcoalTransparentCharcoal
    : props.theme.buttonColors.silverTransparentBlack,
}))`
  z-index: 1;
`;

type Props = {
  label: string;
  item: SwitchSelectableTextLink;
  itemIndex: number;
  isSelected: boolean;
};

const InnerPillButton: FunctionComponent<Props> = ({
  label,
  item,
  itemIndex,
  isSelected,
}: Props) => {
  const { isEnhanced } = useAppContext();

  return (
    <PillButton
      variant="ButtonSolid"
      isPill
      text={item.text}
      $selected={isSelected}
      data-gtm-trigger={`tab_${toSnakeCase(label)}`}
      data-gtm-label={item.text}
      data-gtm-category={item.gtmData?.category}
      data-gtm-position-in-list={itemIndex + 1}
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
