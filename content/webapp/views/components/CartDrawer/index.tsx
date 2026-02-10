import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { clear } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { useCartContext } from '@weco/content/contexts/CartContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
`;

const Drawer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 400px;
  max-width: 90vw;
  background: ${props => props.theme.color('white')};
  z-index: 11;
  transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
`;

const DrawerHeader = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};
`;

const DrawerTitle = styled.h2.attrs({
  className: font('brand', 0),
})`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
`;

const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const DrawerFooter = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
})`
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
`;

const ItemRow = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
})`
  display: flex;
  gap: 12px;
  border-bottom: 1px solid ${props => props.theme.color('neutral.200')};
`;

const ItemImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  background: ${props => props.theme.color('warmNeutral.300')};
  flex-shrink: 0;
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.p.attrs({
  className: font('sans-bold', -1),
})`
  margin: 0;
`;

const ItemVariant = styled.p.attrs({
  className: font('sans', -2),
})`
  margin: 0;
  color: ${props => props.theme.color('neutral.600')};
`;

const ItemPrice = styled.p.attrs({
  className: font('sans', -1),
})`
  margin: 0;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const QuantityButton = styled.button`
  background: ${props => props.theme.color('warmNeutral.300')};
  border: none;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;

  &:hover {
    background: ${props => props.theme.color('neutral.300')};
  }
`;

const QuantityValue = styled.span.attrs({
  className: font('sans', -1),
})``;

const RemoveButton = styled.button.attrs({
  className: font('sans', -2),
})`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: ${props => props.theme.color('neutral.600')};
  text-decoration: underline;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.span.attrs({
  className: font('sans-bold', 0),
})``;

const TotalPrice = styled.span.attrs({
  className: font('sans-bold', 0),
})``;

const CheckoutButton = styled.button.attrs({
  className: font('sans-bold', -1),
})`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background: ${props => props.theme.color('accent.green')};
  color: ${props => props.theme.color('white')};
  border: none;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  cursor: pointer;
  text-align: center;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyMessage = styled(Space).attrs({
  className: font('sans', 0),
  $v: { size: 'xl', properties: ['padding-top'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
})`
  text-align: center;
  color: ${props => props.theme.color('neutral.600')};
`;

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

const CartDrawer: FunctionComponent = () => {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    currencyCode,
    removeItem,
    updateQuantity,
    clearCart,
    setIsOpen,
  } = useCartContext();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        clearCart();
        setIsOpen(false);
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <Drawer
        $isOpen={isOpen}
        ref={drawerRef}
        aria-label="Shopping cart"
        data-component="cart-drawer"
      >
        <DrawerHeader>
          <DrawerTitle>Cart ({totalItems})</DrawerTitle>
          <CloseButton onClick={() => setIsOpen(false)} aria-label="Close cart">
            <Icon icon={clear} />
          </CloseButton>
        </DrawerHeader>

        <DrawerBody>
          {items.length === 0 ? (
            <EmptyMessage>Your cart is empty.</EmptyMessage>
          ) : (
            items.map(item => (
              <ItemRow key={item.variantId}>
                {item.image && (
                  <ItemImage
                    src={item.image.url}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                  />
                )}
                <ItemDetails>
                  <ItemTitle>{item.title}</ItemTitle>
                  {item.variantTitle !== 'Default Title' && (
                    <ItemVariant>{item.variantTitle}</ItemVariant>
                  )}
                  <ItemPrice>
                    {formatPrice(
                      parseFloat(item.price.amount),
                      item.price.currencyCode
                    )}
                  </ItemPrice>
                  <QuantityControls>
                    <QuantityButton
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      -
                    </QuantityButton>
                    <QuantityValue>{item.quantity}</QuantityValue>
                    <QuantityButton
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </QuantityButton>
                  </QuantityControls>
                  <Space $v={{ size: 'xs', properties: ['margin-top'] }}>
                    <RemoveButton
                      onClick={() => removeItem(item.variantId)}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      Remove
                    </RemoveButton>
                  </Space>
                </ItemDetails>
              </ItemRow>
            ))
          )}
        </DrawerBody>

        {items.length > 0 && (
          <DrawerFooter>
            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalPrice>{formatPrice(totalPrice, currencyCode)}</TotalPrice>
            </TotalRow>
            <CheckoutButton onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? 'Redirecting...' : 'Checkout'}
            </CheckoutButton>
          </DrawerFooter>
        )}
      </Drawer>
    </>
  );
};

export default CartDrawer;
