import React from 'react';
import styled from 'styled-components';
import LL from '@weco/common/views/components/styled/LL';

const Centered = styled.div`
  position: relative;
  height: 100%;
  min-height: 200px;
  display: grid;
  place-items: center;
`;

export const Loading: React.FC = () => (
  <Centered>
    <LL lighten={false} />
    <span className="visually-hidden" role="status" aria-label="loading">
      Loading
    </span>
  </Centered>
);
