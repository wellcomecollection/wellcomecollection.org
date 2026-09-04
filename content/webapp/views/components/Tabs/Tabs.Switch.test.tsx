import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import AppContext, {
  appContextDefaults,
  AppContextProvider,
} from '@weco/common/contexts/AppContext';
import theme from '@weco/common/views/themes/default';

import TabsSwitch from './Tabs.Switch';

// TabsSwitch drives its anchor changes through the router (shallow), rather
// than a raw history.pushState/replaceState - see Tabs.Switch.tsx for why.
// This stand-in performs the same real history update the component relies
// on for its own hashchange listener, without needing a full Next.js router.
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (url: string) => globalThis.history.pushState({}, '', url),
    replace: (url: string) => globalThis.history.replaceState({}, '', url),
  }),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn(); // scrollIntoView is not in JSDOM: https://stackoverflow.com/a/60225417

const items = [
  { id: 'about', text: 'About', dataGtmProps: { label: 'About' } },
  { id: 'contents', text: 'Contents', dataGtmProps: { label: 'Contents' } },
];

const TabsSwitchHarness = ({
  initialTab = 'about',
}: {
  initialTab?: string;
}) => {
  const [selectedTab, setSelectedTab] = useState(initialTab);
  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <TabsSwitch
          label="Test tabs"
          items={items}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </AppContextProvider>
    </ThemeProvider>
  );
};

const renderComponent = (initialTab?: string) => {
  render(<TabsSwitchHarness initialTab={initialTab} />);
};

// Renders with isEnhanced permanently false, to inspect the no-JS fallback
// markup without waiting on AppContextProvider's post-mount enhancement flip.
const renderNotEnhanced = () => {
  const NotEnhancedHarness = () => {
    const [selectedTab, setSelectedTab] = useState('about');
    return (
      <ThemeProvider theme={theme}>
        <AppContext.Provider
          value={{ ...appContextDefaults, isEnhanced: false }}
        >
          <TabsSwitch
            label="Test tabs"
            items={items}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </AppContext.Provider>
      </ThemeProvider>
    );
  };
  render(<NotEnhancedHarness />);
};

describe('TabsSwitch', () => {
  beforeEach(() => {
    (window.HTMLElement.prototype.scrollIntoView as jest.Mock).mockClear();
  });

  afterEach(() => {
    window.history.replaceState(null, '', '#');
  });

  it('marks the initially selected tab as selected', () => {
    renderComponent();
    expect(screen.getByRole('tab', { name: 'About' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('does not add an anchor to a fresh URL that had none', () => {
    renderComponent();
    expect(window.location.hash).toBe('');
  });

  it('updates the URL anchor to match the selected tab when clicked', async () => {
    renderComponent();
    await act(async () => {
      await userEvent.click(screen.getByRole('tab', { name: 'Contents' }));
    });

    expect(screen.getByRole('tab', { name: 'Contents' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(window.location.hash).toBe('#contents');
  });

  it('opens the tab matching the URL anchor on load, and scrolls to it', async () => {
    window.history.replaceState(null, '', '#contents');
    renderComponent();

    const contentsTab = await screen.findByRole('tab', {
      name: 'Contents',
      selected: true,
    });
    expect(contentsTab).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'About', selected: false })
    ).toBeInTheDocument();

    const scrollIntoView = window.HTMLElement.prototype
      .scrollIntoView as jest.Mock;
    expect(scrollIntoView.mock.instances).toContain(contentsTab);
  });

  it('ignores a URL anchor that does not match any tab, and leaves it untouched', () => {
    // e.g. a concept page's own #works/#images anchor, or a sub-theme page's
    // #stories - not one of this component's own tabs, so must be left alone.
    window.history.replaceState(null, '', '#not-a-real-tab');
    renderComponent();

    expect(screen.getByRole('tab', { name: 'About' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(window.location.hash).toBe('#not-a-real-tab');
  });

  it('switches tab and scrolls to it when the URL anchor changes without a full page load', async () => {
    renderComponent();
    expect(screen.getByRole('tab', { name: 'About' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    await act(async () => {
      window.history.replaceState(null, '', '#contents');
      window.dispatchEvent(new Event('hashchange'));
    });

    const contentsTab = screen.getByRole('tab', { name: 'Contents' });
    expect(contentsTab).toHaveAttribute('aria-selected', 'true');

    const scrollIntoView = window.HTMLElement.prototype
      .scrollIntoView as jest.Mock;
    expect(scrollIntoView.mock.instances).toContain(contentsTab);
  });

  it('lets the browser back button step back to the virgin URL and first tab', async () => {
    renderComponent();
    await act(async () => {
      await userEvent.click(screen.getByRole('tab', { name: 'Contents' }));
    });
    expect(window.location.hash).toBe('#contents');

    await act(async () => {
      window.history.back();
    });

    await waitFor(() =>
      expect(screen.getByRole('tab', { name: 'About' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
    );
    expect(window.location.hash).toBe('');
  });

  it('points the no-JS fallback link at the tabpanel, not a bare tab id', () => {
    renderNotEnhanced();

    const contentsLink = screen.getByRole('link', { name: 'Contents' });
    expect(contentsLink).toHaveAttribute('href', '#tabpanel-contents');
  });
});
