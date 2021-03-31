import React, { useState } from 'react';
import { Chevron } from '../Icons/Chevron';
import { Container, Menu, MenuButton } from './DropdownMenu.style';

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(wasOpen => !wasOpen);

  return (
    <Container>
      <MenuButton onClick={toggleOpen}>
        Account actions{' '}
        <Chevron
          fill="currentColor"
          height="24"
          width="24"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </MenuButton>
      {isOpen && <Menu>{children}</Menu>}
    </Container>
  );
};
