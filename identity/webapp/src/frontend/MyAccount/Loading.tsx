import React from 'react';
import styled from 'styled-components';
import LL from '@weco/common/views/components/styled/LL';

export const Loading: React.FunctionComponent = () => (
  <>
    <LL $lighten={false} />
    <span className="visually-hidden" role="status" aria-label="loading">
      Loading
    </span>
  </>
);

const InlineWrapper = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
`;

export const InlineLoading: React.FunctionComponent = () => (
  <InlineWrapper>
    <LL $small={true} $lighten={true} />
    <span className="visually-hidden">Loading</span>
  </InlineWrapper>
);
