import { useState, useRef, FunctionComponent } from 'react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { workWithPartOf } from '@weco/content/test/fixtures/catalogueApi/work';
import prismicData from '@weco/common/test/fixtures/prismicData/prismic-data';
import ItemRequestModal from '../../components/ItemRequestModal/ItemRequestModal';
import { getItemsWithPhysicalLocation } from '../../utils/works';
import * as Context from '@weco/common/server-data/Context';
import * as DateUtils from '../../utils/dates';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

jest.spyOn(Context, 'usePrismicData').mockImplementation(() => prismicData);

jest
  .spyOn(DateUtils, 'determineNextAvailableDate')
  .mockImplementation(() => new Date('2022-05-21'));

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
  it('allows an available date to selected (based on business rules about what dates for collection should be available) and displays the entered date', async () => {
    const { getByLabelText } = renderWithTheme(<RequestModal />);
    const select = getByLabelText(/^Select a date$/i) as HTMLSelectElement;
    await act(async () => {
      await userEvent.selectOptions(select, '23-05-2022');
    });
    expect(select.value).toBe('23-05-2022');
  });
});
