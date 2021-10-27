import React from 'react';
import LL from '@weco/common/views/components/styled/LL';

export const Loading: React.FC = () => (
  <>
    <LL lighten={false} />
    <span className="visually-hidden" role="status" aria-label="loading">
      Loading
    </span>
  </>
);
