import React from 'react';
import { render, screen } from './test-utils';
import { getAppPathPrefix } from '../utility/app-path-prefix';

const ComponentWithPrefix = () => (
  <div data-test-id="dummy-div">{getAppPathPrefix()}</div>
);

const renderComponent = (contextPath?: string) => {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  if (contextPath) {
    root.setAttribute('data-context-path', contextPath);
  }
  return render(<ComponentWithPrefix />, {
    container: document.body.appendChild(root),
  });
};

describe('getAppPathPrefix (frontend)', () => {
  it('returns the prefix string when one is present', () => {
    renderComponent('/batman');
    expect(screen.getByTestId('dummy-div')).toHaveTextContent('/batman');
  });

  it('returns an empty string when no prefix is present', () => {
    renderComponent();
    expect(screen.getByTestId('dummy-div')).toHaveTextContent('');
  });
});
