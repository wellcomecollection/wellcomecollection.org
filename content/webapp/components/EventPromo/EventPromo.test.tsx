import { render, screen } from '@testing-library/react';
import prismicData from '@weco/common/test/fixtures/prismicData/prismic-data';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import EventPromo from './EventPromo';
import * as Context from '@weco/common/server-data/Context';
import { UiEvent } from '@weco/common/model/events';
import {
  eventWithPlace,
  eventOnline,
  eventWithPlaceOnline,
} from '../../__mocks__/events';
jest.spyOn(Context, 'useToggles').mockImplementation(() => ({
  enablePickUpDate: true,
}));

jest
  .spyOn(Context, 'usePrismicData')
  .mockImplementation(() => prismicData as any);

const renderComponent = (event: UiEvent) => {
  return render(
    <ThemeProvider theme={theme}>
      <EventPromo event={event} />
    </ThemeProvider>
  );
};

describe('EventPromo', () => {
  it('Shows a specific location when it is the only location for an event', () => {
    renderComponent(eventWithPlace);
    expect(screen.getByText('Reading Room'));
  });

  it('Shows when an event is online', () => {
    renderComponent(eventOnline);
    expect(screen.getByText('Online'));
  });

  it('Shows when an event is a physical/online hybrid', () => {
    renderComponent(eventWithPlaceOnline);
    expect(screen.getByText('Online & In our building'));
  });
});
