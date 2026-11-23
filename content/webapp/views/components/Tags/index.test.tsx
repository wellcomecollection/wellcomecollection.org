import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import AppContext, {
  appContextDefaults,
} from '@weco/common/contexts/AppContext';
import { createTheme } from '@weco/common/views/themes/config';

import Tags, { TagType } from './index';

const theme = createTheme(true);

const tags = (count: number): TagType[] =>
  Array.from({ length: count }, (_, i) => ({
    textParts: [`Subject ${i + 1}`],
    linkAttributes: { href: { pathname: `/concepts/subject-${i + 1}` } },
  }));

const renderTags = ({
  count,
  maxVisible,
  isEnhanced = true,
}: {
  count: number;
  maxVisible?: number;
  isEnhanced?: boolean;
}) =>
  render(
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ ...appContextDefaults, isEnhanced }}>
        <Tags
          tags={tags(count)}
          maxVisible={maxVisible}
          showAllText="Show all subjects"
          showFewerText="Show fewer subjects"
        />
      </AppContext.Provider>
    </ThemeProvider>
  );

const showAllButton = () =>
  screen.queryByRole('button', { name: /show all subjects/i });

const showFewerButton = () =>
  screen.queryByRole('button', { name: /show fewer subjects/i });

describe('Tags', () => {
  it('shows every tag when there is no maxVisible', () => {
    renderTags({ count: 12 });

    expect(screen.getAllByRole('listitem')).toHaveLength(12);
    expect(showAllButton()).not.toBeInTheDocument();
  });

  it('collapses to maxVisible tags, behind a control', () => {
    renderTags({ count: 12, maxVisible: 10 });

    expect(screen.getByText('Subject 10')).toBeInTheDocument();
    expect(screen.queryByText('Subject 11')).not.toBeInTheDocument();
    expect(showAllButton()).toBeInTheDocument();
  });

  it('names the control without the +', () => {
    renderTags({ count: 12, maxVisible: 10 });

    expect(
      screen.getByRole('button', { name: 'Show all subjects' })
    ).toBeInTheDocument();
  });

  it('leaves the list alone when it is already within maxVisible', () => {
    renderTags({ count: 10, maxVisible: 10 });

    expect(screen.getByText('Subject 10')).toBeInTheDocument();
    expect(showAllButton()).not.toBeInTheDocument();
  });

  it('reveals the rest when the control is used, and offers the way back', async () => {
    const user = userEvent.setup();
    renderTags({ count: 12, maxVisible: 10 });

    await user.click(showAllButton()!);

    expect(screen.getByText('Subject 11')).toBeInTheDocument();
    expect(screen.getByText('Subject 12')).toBeInTheDocument();
    expect(showFewerButton()).toBeInTheDocument();
  });

  it('collapses back to maxVisible tags when the control is used again', async () => {
    const user = userEvent.setup();
    renderTags({ count: 12, maxVisible: 10 });

    await user.click(showAllButton()!);
    await user.click(showFewerButton()!);

    expect(screen.getByText('Subject 10')).toBeInTheDocument();
    expect(screen.queryByText('Subject 11')).not.toBeInTheDocument();
    expect(showAllButton()).toBeInTheDocument();
  });

  // The control sits after the tags, so without this the revealed links are
  // behind the user's focus position and the next Tab leaves the list.
  it('moves focus to the first revealed tag', async () => {
    const user = userEvent.setup();
    renderTags({ count: 12, maxVisible: 10 });

    await user.click(showAllButton()!);

    expect(screen.getByText('Subject 11').closest('a')).toHaveFocus();
  });

  it('leaves focus on the control when collapsing', async () => {
    const user = userEvent.setup();
    renderTags({ count: 12, maxVisible: 10 });

    await user.click(showAllButton()!);
    await user.click(showFewerButton()!);

    expect(showAllButton()).toHaveFocus();
  });

  // Without JavaScript the control can't do anything, so nothing should hide
  // behind it.
  it('shows every tag when the page is not enhanced', () => {
    renderTags({ count: 12, maxVisible: 10, isEnhanced: false });

    expect(screen.getAllByRole('listitem')).toHaveLength(12);
    expect(showAllButton()).not.toBeInTheDocument();
  });
});
