import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { shoppingBag } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { BorderlessButton } from '@weco/common/views/components/BorderlessClickable';
import { useCartContext } from '@weco/content/contexts/CartContext';

const Wrapper = styled.span`
  position: relative;
`;

const Badge = styled.span.attrs({
  className: font('sans-bold', -2),
})`
  position: absolute;
  top: 2px;
  right: 0;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  background: ${props => props.theme.color('accent.green')};
  color: ${props => props.theme.color('white')};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const CartHeaderButton: FunctionComponent = () => {
  const { totalItems, setIsOpen } = useCartContext();

  return (
    <Wrapper data-component="cart-header-button">
      <BorderlessButton
        iconLeft={shoppingBag}
        text="Cart"
        isTextHidden={true}
        clickHandler={() => setIsOpen(true)}
        aria-label={`Cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
      />
      {totalItems > 0 && <Badge>{totalItems}</Badge>}
    </Wrapper>
  );
};

export default CartHeaderButton;
