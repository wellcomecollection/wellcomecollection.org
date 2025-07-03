import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FunctionComponent, useRef, useState } from 'react';
import '@testing-library/jest-dom';

import { itemRequestDialog } from '@weco/common/data/microcopy';
import * as Context from '@weco/common/server-data/Context';
import prismicData from '@weco/common/test/fixtures/prismicData/prismic-data';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { workWithPartOf } from '@weco/content/test/fixtures/catalogueApi/work';
import { getItemsWithPhysicalLocation } from '@weco/content/utils/works';

import ItemRequestModal from '.';

jest.spyOn(Context, 'usePrismicData').mockImplementation(() => prismicData);

const mockDateNow = (dateToMock: string) => {
  jest.useFakeTimers().setSystemTime(new Date(dateToMock));
};

const RequestModal: FunctionComponent = () => {
  const [requestModalIsActive, setRequestModalIsActive] = useState(true);
  const item = getItemsWithPhysicalLocation(workWithPartOf.items ?? [])[0];
  const openButtonRef = useRef(null);

  return (
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
  );
};

describe('ItemRequestModal', () => {
  it('allows an available date (as returned with the item from the itemsAPI) to be selected, and displays the entered date', async () => {
    const { getByLabelText } = renderWithTheme(<RequestModal />);
    const select = getByLabelText(/^Select a date$/i) as HTMLSelectElement;
    await act(async () => {
      await userEvent.selectOptions(select, '23-05-2022');
    });
    expect(select.value).toBe('23-05-2022');
  });

  it('shows the correct lead time for onsite items', async () => {
    mockDateNow('2024-03-21T19:00:00.000Z');

    const { getByTestId } = renderWithTheme(<RequestModal />);
    const message = getByTestId('pickup-deadline');
    expect(message).toHaveTextContent(
      `${itemRequestDialog.pickupItemOn} Monday 23 May.`
    );
  });

  it('shows the correct lead time for offsite/deepstore items', async () => {
    mockDateNow('2022-05-09T19:00:00.000Z');

    const { getByTestId } = renderWithTheme(<RequestModal />);
    const message = getByTestId('pickup-deadline');
    expect(message).toHaveTextContent(
      `${itemRequestDialog.pickupItemOn} Monday 23 May.`
    );
  });
});
