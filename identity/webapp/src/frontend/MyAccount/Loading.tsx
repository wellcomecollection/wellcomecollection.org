import React from 'react';
import styled from 'styled-components';
import LL from '@weco/common/views/components/styled/LL';

const Centered = styled.div`
  height: 100%;
  display: grid;
  place-items: center;
`;

export const Loading = () => (
  <Centered>
    <>
      <LL lighten={false} />
      <span className="visually-hidden" role="status">Loading</span>
    </>
  </Centered>
);
