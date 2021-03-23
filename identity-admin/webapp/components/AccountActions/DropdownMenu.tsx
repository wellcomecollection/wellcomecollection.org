import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Button';
import { Chevron } from '../Icons/Chevron';

const Container = styled.div`
  margin-left: auto;
  position: relative;
`;

const MenuButton = styled(Button)`
  padding: 0 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

const Menu = styled.div`
  background-color: white;
  position: absolute;
  top: 100%;
  right: 0;
  width: 18em;
  margin-top: 0.333em;
  z-index: 2;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14);

  & ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  & li {
    padding: 0.666em 1em;
  }

  & li:hover {
    background-color: rgba(0, 0, 0, 0.14);
    cursor: pointer;
  }
`;

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(wasOpen => !wasOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      container.current &&
      !container.current.contains(event.target as Element)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container ref={container}>
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
