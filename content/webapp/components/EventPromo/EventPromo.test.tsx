import { render, screen } from '@testing-library/react';
import prismicData from '@weco/common/test/fixtures/prismicData/prismic-data';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import EventPromo from './EventPromo';
import * as Context from '@weco/common/server-data/Context';
import { Event } from '@weco/common/model/events';
import {
  eventWithOneLocation,
  eventOnline,
  eventWithOneLocationOnline,
} from '../../__mocks__/events';
jest.spyOn(Context, 'useToggles').mockImplementation(() => ({
  enablePickUpDate: true,
}));

jest
  .spyOn(Context, 'usePrismicData')
  .mockImplementation(() => prismicData as any);

const renderComponent = (event: Event) => {
  return render(
    <ThemeProvider theme={theme}>
      <EventPromo event={event} />
    </ThemeProvider>
  );
};

describe('EventPromo', () => {
  it('Shows a specific location when it is the only location for an event', () => {
    renderComponent(eventWithOneLocation);
    expect(screen.getByText('Reading Room'));
  });

  it('Shows when an event is online', () => {
    renderComponent(eventOnline);
    expect(screen.getByText('Online'));
  });

  it('Shows when an event is a physical/online hybrid', () => {
    renderComponent(eventWithOneLocationOnline);
    expect(screen.getByText('Online & In our building'));
  });
});
