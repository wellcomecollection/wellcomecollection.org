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

jest.spyOn(Context, 'usePrismicData').mockImplementation(() => prismicData);

jest
  .spyOn(dates, 'determineNextAvailableDate')
  .mockImplementation(() => london('2020-12-21'));

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
  // Needs additional tests when calendar introduced
  it("lets a user select an available date (based on business rules on what dates for collection should be available)/lets a user see what date they've selected", () => {
    renderComponent();
    const input = screen.getByLabelText(/^Select a date$/i) as HTMLInputElement;
    userEvent.type(input, '22/01/2020');
    expect(input.value).toBe('22/01/2020');
  });

  // Needs additional tests when calendar is introduced
  it('lets users see what dates are available / unavailable to select', () => {
    renderComponent();
    expect(
      screen.getByText(
        'You can choose a date between Monday 21 December and Tuesday 05 January. Please bear in mind the library is closed on Sundays and will also be closed on Thursday 24 December, Friday 25 December and Sunday 27 December.'
      )
    );
  });

  it('advises a user that a date they have selected is unavailable and prompts them to re-select', () => {
    renderComponent();
    const input = screen.getByLabelText(/^Select a date$/i) as HTMLInputElement;
    userEvent.type(input, '25/12/2020');
    expect(screen.getByText('Your chosen date is not available to book'));
  });

  it("advises a user that the date they've entered is in the wrong format", () => {
    renderComponent();
    const input = screen.getByLabelText(/^Select a date$/i) as HTMLInputElement;
    userEvent.type(input, '2/122020');
    expect(
      screen.getByText('Please enter a date in the correct format (DD/MM/YYYY)')
    );
  });
});
