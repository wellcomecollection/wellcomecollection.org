import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import AppContext, {
  appContextDefaults,
} from '@weco/common/contexts/AppContext';
import theme from '@weco/common/views/themes/default';

import WorksTree from './WorkDetails.Tree';

const renderWorksTree = (isKiosk: boolean = false) => {
  return render(
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={appContextDefaults}>
        <WorksTree isKiosk={isKiosk}>
          <div>Tree content</div>
        </WorksTree>
      </AppContext.Provider>
    </ThemeProvider>
  );
};

describe('WorkDetails.Tree', () => {
  it('shows all table headers by default including Download', () => {
    renderWorksTree();

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('File format')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('hides the Download header in kiosk mode', () => {
    renderWorksTree(true);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('File format')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.queryByText('Download')).not.toBeInTheDocument();
  });
});
