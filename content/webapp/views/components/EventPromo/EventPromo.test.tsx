import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import * as Context from '@weco/common/server-data/Context';
import prismicData from '@weco/common/test/fixtures/prismicData/prismic-data';
import theme from '@weco/common/views/themes/default';
import {
  eventFullyBooked,
  eventOnline,
  eventWithMultipleLocations,
  eventWithOneLocation,
  eventWithOneLocationOnline,
  location,
} from '@weco/content/__mocks__/events';
import { Event } from '@weco/content/types/events';

import EventPromo, { getLocationText } from '.';

jest
  .spyOn(Context, 'usePrismicData')
  /* eslint-disable @typescript-eslint/no-explicit-any */
  .mockImplementation(() => prismicData as any);
/* eslint-enable @typescript-eslint/no-explicit-any */

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

  it('Shows a generic location when there are multiple physical locations', () => {
    renderComponent(eventWithMultipleLocations);
    expect(screen.getByText('In our building'));
  });

  it('Shows when an event is online', () => {
    renderComponent(eventOnline);
    expect(screen.getByText('Online'));
  });

  it('Shows when an event is a physical/online hybrid', () => {
    renderComponent(eventWithOneLocationOnline);
    expect(screen.getByText('Online | In our building'));
  });

  it('Shows when an event if fully booked', () => {
    renderComponent(eventFullyBooked);
    expect(screen.getByText('Fully booked'));
  });
});

describe('getLocationText', () => {
  it('returns the specific location given one physical location only (and not online)', () => {
    const locationText = getLocationText(false, [location]);
    expect(locationText).toEqual('Reading Room');
  });

  it('returns "In our building" given one physical location which has the name "Throughout our building"', () => {
    const locationText = getLocationText(false, [
      {
        ...location,
        title: 'Throughout our building',
      },
    ]);
    expect(locationText).toEqual('In our building');
  });

  it('returns "In our building" given more than one physical location (and not online)', () => {
    const locationText = getLocationText(false, [location, location]);
    expect(locationText).toEqual('In our building');
  });

  it('returns "Online" if an event is online only', () => {
    const locationText = getLocationText(true, []);
    expect(locationText).toEqual('Online');
  });

  it('returns "Online | In our building" if an event is online and has one or more physical locations', () => {
    const locationText = getLocationText(true, [location]);
    const locationText2 = getLocationText(true, [location, location]);
    expect(locationText).toEqual('Online | In our building');
    expect(locationText2).toEqual('Online | In our building');
  });

  it('returns undefined if Content API place label is missing', () => {
    const locationText = getLocationText(false, [
      { type: 'EventPlace', id: '123' },
    ]);
    expect(locationText).toEqual(undefined);
  });
});
