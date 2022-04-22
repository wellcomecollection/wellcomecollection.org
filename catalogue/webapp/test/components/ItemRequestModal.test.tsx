import { useState, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { workWithPartOf } from '@weco/common/test/fixtures/catalogueApi/work';
import prismicData from '@weco/common/test/fixtures/prismicData/prismic-data';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import ItemRequestModal from '../../components/ItemRequestModal/ItemRequestModal';
import userEvent from '@testing-library/user-event';
import { london } from '@weco/common/utils/format-date';
import { getItemsWithPhysicalLocation } from '../../utils/works';
import * as dates from '@weco/catalogue/utils/dates';
import * as Context from '@weco/common/server-data/Context';

jest.spyOn(Context, 'useToggles').mockImplementation(() => ({
  enablePickUpDate: true,
}));

jest
  .spyOn(Context, 'usePrismicData')
  .mockImplementation(() => prismicData as any);

const renderComponent = () => {
  const RequestModal = () => {
    const [requestModalIsActive, setRequestModalIsActive] = useState(true);
    const item = getItemsWithPhysicalLocation(workWithPartOf.items ?? [])[0];
    const openButtonRef = useRef(null);

    return (
      <ThemeProvider theme={theme}>
        <ItemRequestModal
          isActive={requestModalIsActive}
          setIsActive={setRequestModalIsActive}
          item={item}
          work={workWithPartOf}
          initialHoldNumber={2}
          onSuccess={() => {
            return undefined;
          }}
          openButtonRef={openButtonRef}
        />
      </ThemeProvider>
    );
  };
  render(<RequestModal />);
};

describe('ItemRequestModal', () => {
  it('allows an available date to be entered in the input (based on business rules about what dates for collection should be available) and displays the entered date', () => {
    renderComponent();
    const input = screen.getByLabelText(/^Select a date$/i) as HTMLInputElement;
    userEvent.type(input, '22/01/2020');
    expect(input.value).toBe('22/01/2020');
  });

  it('allows an available date to be selected from the calendar (based on business rules on what dates for collection should be available) and displays the selected date', () => {
    const spy = jest
      .spyOn(dates, 'determineNextAvailableDate')
      .mockImplementation(() => london('2020-10-02'));
    renderComponent();
    const input = screen.getByLabelText(/^Select a date$/i) as HTMLInputElement;
    const calendarButton = screen.getByLabelText(/^calendar day picker$/i);
    userEvent.click(calendarButton);
    const date = screen.getByText(/^14$/i);
    userEvent.click(date);
    expect(input.value).toBe('14/10/2020');

    spy.mockRestore();
  });

  it('displays text about which dates are available / unavailable to select', () => {
    const spy = jest
      .spyOn(dates, 'determineNextAvailableDate')
      .mockImplementation(() => london('2020-12-21'));
    renderComponent();
    expect(
      screen.getByText(
        'You can choose a date between Monday 21 December and Tuesday 05 January. Please bear in mind the library is closed on Sundays and will also be closed on Thursday 24 December, Friday 25 December and Sunday 27 December.'
      )
    );
    spy.mockRestore();
  });

  it('only shows closed dates that occur within the selectable period', () => {
    const spy = jest
      .spyOn(dates, 'determineNextAvailableDate')
      .mockImplementation(() => london('2020-12-26'));
    renderComponent();
    expect(
      screen.getByText(
        'You can choose a date between Saturday 26 December and Friday 08 January. Please bear in mind the library is closed on Sundays and will also be closed on Sunday 27 December.'
      )
    );
    spy.mockRestore();
  });

  it('advises when a selected is unavailable', () => {
    renderComponent();
    const input = screen.getByLabelText(/^Select a date$/i) as HTMLInputElement;
    userEvent.type(input, '25/12/2020');
    expect(screen.getByText('Your chosen date is not available to book'));
  });

  it('advises when an entered is in an incorrect format', () => {
    renderComponent();
    const input = screen.getByLabelText(/^Select a date$/i) as HTMLInputElement;
    userEvent.type(input, '2/122020');
    expect(
      screen.getByText('Please enter a date in the correct format (DD/MM/YYYY)')
    );
  });

  it('fills the input with the focused date in the calendar when the enter key is pressed', () => {
    const spy = jest
      .spyOn(dates, 'determineNextAvailableDate')
      .mockImplementation(() => london('2020-10-02'));
    renderComponent();
    const input = screen.getByLabelText(/^Select a date$/i) as HTMLInputElement;
    const calendarButton = screen.getByLabelText(/^calendar day picker$/i);
    userEvent.click(calendarButton);
    userEvent.keyboard('{Enter}');
    expect(input.value).toBe('02/10/2020');
    spy.mockRestore();
  });

  it('fills the input with the focused date in the calendar when the spacebar is pressed', () => {
    const spy = jest
      .spyOn(dates, 'determineNextAvailableDate')
      .mockImplementation(() => london('2020-10-02'));
    renderComponent();
    const input = screen.getByLabelText(/^Select a date$/i) as HTMLInputElement;
    const calendarButton = screen.getByLabelText(/^calendar day picker$/i);
    userEvent.click(calendarButton);
    userEvent.keyboard(' ');
    expect(input.value).toBe('02/10/2020');
    spy.mockRestore();
  });
});
