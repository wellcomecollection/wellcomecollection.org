import { useState, useRef, FunctionComponent } from 'react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  workFixture,
  workWithPartOf,
} from '@weco/content/test/fixtures/catalogueApi/work';
import prismicData from '@weco/common/test/fixtures/prismicData/prismic-data';
import ItemRequestModal from '../../components/ItemRequestModal/ItemRequestModal';
import { getItemsWithPhysicalLocation } from '../../utils/works';
import * as Context from '@weco/common/server-data/Context';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

jest.spyOn(Context, 'usePrismicData').mockImplementation(() => prismicData);

type Props = {
  deepstoreLocationType?: boolean | undefined;
};

const RequestModal: FunctionComponent<Props> = ({ deepstoreLocationType }) => {
  const [requestModalIsActive, setRequestModalIsActive] = useState(true);
  const item = getItemsWithPhysicalLocation(workWithPartOf.items ?? [])[0];
  const deepstoreItem = getItemsWithPhysicalLocation(
    workFixture.items ?? []
  )[0];
  const openButtonRef = useRef(null);

  return (
    <ItemRequestModal
      isActive={requestModalIsActive}
      setIsActive={setRequestModalIsActive}
      item={deepstoreLocationType ? deepstoreItem : item}
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
    const { getByTestId } = renderWithTheme(<RequestModal />);
    const message = getByTestId('pickup-deadline');
    expect(message).toHaveTextContent(
      'Item requests need to be placed by 10am on the working day before your visit'
    );
  });

  it('shows the correct lead time for offsite/deepstore items', async () => {
    const { getByTestId } = renderWithTheme(
      <RequestModal deepstoreLocationType />
    );
    const message = getByTestId('pickup-deadline');
    expect(message).toHaveTextContent(
      'Item requests for offsite material need to be placed by 10am, 10 working days before your visit'
    );
  });
});
