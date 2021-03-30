import React from 'react';
import styled from 'styled-components';

const Centered = styled.div`
  height: 100%;
  display: grid;
  place-items: center;
`;

export const Loading: React.FC = () => (
  <Centered>
    <progress aria-label="Loading"></progress>
  </Centered>
);
