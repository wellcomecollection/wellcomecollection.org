import { useState, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { workWithPartOf } from '@weco/common/test/fixtures/catalogueApi/work';
import prismicData from '@weco/common/test/fixtures/prismicData/prismic-data';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import ItemRequestModal from '../../components/ItemRequestModal/ItemRequestModal';
import userEvent from '@testing-library/user-event';
import { getItemsWithPhysicalLocation } from '../../utils/works';
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
  it('allows an available date to selected (based on business rules about what dates for collection should be available) and displays the entered date', () => {
    renderComponent();
    const select = screen.getByLabelText(
      /^Select a date$/i
    ) as HTMLSelectElement;
    userEvent.selectOptions(select, '23-05-2022');
    expect(select.value).toBe('23-05-2022');
  });
});
