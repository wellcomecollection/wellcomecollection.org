import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import KioskContext, {
  defaultKioskContext,
} from '@weco/common/contexts/KioskContext';
import UserContext, {
  defaultUserContext,
} from '@weco/common/contexts/UserContext';
import theme from '@weco/common/views/themes/default';
import { TransformedCanvas } from '@weco/content/types/manifest';

import DownloadItem from './WorkDetails.DownloadItem';

const mockCanvas: TransformedCanvas = {
  id: 'https://example.com/canvas/1',
  type: 'Canvas',
  label: 'Test Canvas',
  width: 1000,
  height: 800,
  imageServiceId: 'https://example.com/image/1',
  textServiceId: undefined,
  thumbnailImage: undefined,
  painting: [],
  original: [],
  rendering: [],
  supplementing: [],
  metadata: [],
};

const mockDownloadItem = {
  id: 'https://example.com/download/1.jpg',
  type: 'Image' as const,
  format: 'image/jpeg',
  height: 1000,
  width: 800,
};

const renderDownloadItem = (props: {
  isKiosk?: boolean;
  userIsStaffWithRestricted?: boolean;
}) => {
  return render(
    <ThemeProvider theme={theme}>
      <KioskContext.Provider
        value={{
          ...defaultKioskContext,
          isKiosk: props.isKiosk ?? false,
        }}
      >
        <UserContext.Provider
          value={{
            ...defaultUserContext,
            userIsStaffWithRestricted: props.userIsStaffWithRestricted ?? false,
          }}
        >
          <DownloadItem
            canvas={mockCanvas}
            item={mockDownloadItem}
            linkToCanvas={false}
          />
        </UserContext.Provider>
      </KioskContext.Provider>
    </ThemeProvider>
  );
};

describe('WorkDetails.DownloadItem', () => {
  it('shows the download link by default', () => {
    renderDownloadItem({ isKiosk: false });
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('hides the download column in kiosk mode', () => {
    renderDownloadItem({ isKiosk: true });
    expect(screen.queryByText('Download')).not.toBeInTheDocument();
  });

  it('still shows file name and format in kiosk mode', () => {
    renderDownloadItem({ isKiosk: true });
    expect(screen.getByText('Test Canvas')).toBeInTheDocument();
    expect(screen.getByText('jpeg')).toBeInTheDocument();
  });

  it('shows download link for staff with restricted access even for restricted items', () => {
    renderDownloadItem({
      isKiosk: false,
      userIsStaffWithRestricted: true,
    });
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('hides download link in kiosk mode even for staff with restricted access', () => {
    renderDownloadItem({
      isKiosk: true,
      userIsStaffWithRestricted: true,
    });
    expect(screen.queryByText('Download')).not.toBeInTheDocument();
  });
});
