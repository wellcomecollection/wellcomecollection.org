import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import Calendar from '../../components/Calendar/Calendar';
import userEvent from '@testing-library/user-event';
import { london } from '@weco/common/utils/format-date';

const renderComponent = () => {
  render(
    <ThemeProvider theme={theme}>
      <Calendar
        min={london('2022-02-01')}
        max={london('2022-05-20')}
        excludedDates={[
          london('2022-02-07'),
          london('2022-02-08'),
          london('2022-02-09'),
        ]}
        excludedDays={[0]}
        initialFocusDate={london('2022-2-10')}
        chosenDate={undefined}
        setChosenDate={() => null}
        showModal={false}
        setShowModal={() => null}
      />
    </ThemeProvider>
  );
};

describe('Calendar', () => {
  it('is possible to navigate the calendar with the arrow keys', async () => {
    renderComponent();
    // starts on 10
    userEvent.keyboard('{ArrowRight}');
    // moves to 11
    userEvent.keyboard('{ArrowDown}');
    // moves to 18
    userEvent.keyboard('{ArrowDown}');
    // moves to 25
    userEvent.keyboard('{ArrowLeft}');
    // moves to 24
    userEvent.keyboard('{ArrowUp}');
    expect(document.activeElement?.textContent).toEqual('17');
  });

  it('is possible to navigate to the beginning of a row with the home key', async () => {
    renderComponent();
    expect(document.activeElement?.textContent).toEqual('10');
    userEvent.keyboard('{Home}');
    expect(document.activeElement?.textContent).toEqual('7');
  });

  it('is possible to navigate to the end of a row with the end key', async () => {
    renderComponent();
    expect(document.activeElement?.textContent).toEqual('10');
    userEvent.keyboard('{End}');
    expect(document.activeElement?.textContent).toEqual('13');
  });

  it('displays the next month when the pagedown key is pressed', async () => {
    renderComponent();
    const calendarHeading = screen.getByRole('heading', { level: 2 });
    expect(calendarHeading?.textContent).toEqual('February 2022');
    userEvent.keyboard('{PageDown}');
    expect(calendarHeading?.textContent).toEqual('March 2022');
  });

  it('displays the previous month when the pageup key is pressed', async () => {
    renderComponent();
    const calendarHeading = screen.getByRole('heading', { level: 2 });
    expect(calendarHeading?.textContent).toEqual('February 2022');
    userEvent.keyboard('{PageDown}');
    userEvent.keyboard('{PageDown}');
    expect(calendarHeading?.textContent).toEqual('April 2022');
    userEvent.keyboard('{PageUp}');
    expect(calendarHeading?.textContent).toEqual('March 2022');
  });

  it('changes the displayed month, when the month controls are used via keyboard or mouse', async () => {
    renderComponent();
    const calendarHeading = screen.getByRole('heading', { level: 2 });
    expect(calendarHeading?.textContent).toEqual('February 2022');
    userEvent.tab();
    userEvent.tab(); // will focus next month button
    userEvent.keyboard('{Enter}');
    expect(calendarHeading?.textContent).toEqual('March 2022');
    const previousMonthButton = screen.getByRole('button', {
      name: 'previous month',
    });
    userEvent.click(previousMonthButton);
    expect(calendarHeading?.textContent).toEqual('February 2022');
  });

  it('displays which dates on the calendar are available / unavailable to select', async () => {
    renderComponent();
    const calendar = screen.getByRole('grid');
    const disabledCells = calendar?.querySelectorAll('td[aria-disabled=true]');
    const unselectableDates = Array.from(disabledCells).map(
      cell => cell.textContent
    );
    expect(unselectableDates).toEqual([
      '31',
      '6',
      '7',
      '8',
      '9',
      '13',
      '20',
      '27',
      '6',
    ]);
  });
});
