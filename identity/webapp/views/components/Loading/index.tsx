// eslint-data-component: intentionally omitted
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import LL from '@weco/common/views/components/styled/LL';

const InlineWrapper = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
`;

const Loading: FunctionComponent<{ variant?: 'inline' }> = ({ variant }) => {
  if (variant === 'inline') {
    return (
      <InlineWrapper>
        <LL $small={true} $lighten={true} />
        <span className="visually-hidden">Loading</span>
      </InlineWrapper>
    );
  }

  return (
    <>
      <LL $lighten={false} />
      <span className="visually-hidden" role="status" aria-label="loading">
        Loading
      </span>
    </>
  );
};

export default Loading;
