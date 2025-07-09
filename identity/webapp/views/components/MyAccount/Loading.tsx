import { FunctionComponent } from 'react';
import styled from 'styled-components';

import LL from '@weco/common/views/components/styled/LL';

const Loading: FunctionComponent = () => (
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

export const InlineLoading: FunctionComponent = () => (
  <InlineWrapper>
    <LL $small={true} $lighten={true} />
    <span className="visually-hidden">Loading</span>
  </InlineWrapper>
);

export default Loading;
