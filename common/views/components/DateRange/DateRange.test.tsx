import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import DateRange from './DateRange';

describe('DateRange', () => {
  it('renders a date + time range if the start/end are on the same day', () => {
    const start = new Date('2022-09-18T12:00:00+0100');
    const end   = new Date('2022-09-18T14:30:00+0100'); // prettier-ignore

    const component = mountWithTheme(<DateRange start={start} end={end} />);
    expect(component.html()).toEqual(
      '<time datetime="2022-09-18T11:00:00.000Z">Sunday 18 September 2022</time>, ' +
        '<span><time datetime="2022-09-18T11:00:00.000Z">12:00</time> – <time datetime="2022-09-18T13:30:00.000Z">14:30</time></span>'
    );
  });

  it('renders a date range if the start/end are on different days', () => {
    const start = new Date('2022-09-18T12:00:00+0100');
    const end   = new Date('2022-09-25T12:00:00+0100'); // prettier-ignore

    const component = mountWithTheme(<DateRange start={start} end={end} />);
    expect(component.html()).toEqual(
      '<time datetime="2022-09-18T11:00:00.000Z">18 September 2022</time> – ' +
        '<time datetime="2022-09-25T11:00:00.000Z">25 September 2022</time>'
    );
  });

  it('can split a date/time across multiple lines', () => {
    const start = new Date('2022-09-18T12:00:00+0100');
    const end   = new Date('2022-09-18T14:30:00+0100'); // prettier-ignore

    const component = mountWithTheme(
      <DateRange start={start} end={end} splitTime={true} />
    );
    expect(component.html()).toEqual(
      '<time datetime="2022-09-18T11:00:00.000Z">Sunday 18 September 2022</time>' +
        '<span style="display: block;"><time datetime="2022-09-18T11:00:00.000Z">12:00</time> – <time datetime="2022-09-18T13:30:00.000Z">14:30</time></span>'
    );
  });

  it('renders a date + time range if the start/end are on the same London day', () => {
    // It seems unlikely we would ever schedule an event this early in the
    // day, but let’s make sure we handle it properly.  Note that these two
    // times are on the same London day, but different UTC days.

    //                             -17T23:30:00 UTC
    const start = new Date('2022-09-18T00:30:00+0100');

    //                             -18T00:30:00 UTC
    const end   = new Date('2022-09-18T01:30:00+0100'); // prettier-ignore

    const component = mountWithTheme(<DateRange start={start} end={end} />);
    expect(component.html()).toEqual(
      '<time datetime="2022-09-17T23:30:00.000Z">Sunday 18 September 2022</time>, ' +
        '<span><time datetime="2022-09-17T23:30:00.000Z">00:30</time> – <time datetime="2022-09-18T00:30:00.000Z">01:30</time></span>'
    );
  });

  it('renders a date range if the start/end are on different London days', () => {
    // It seems unlikely we would ever schedule an event this late in the
    // day, but let’s make sure we handle it properly.  Note that these two
    // times are on the same UTC day, but different London days.

    //                             -18T22:30:00 UTC
    const start = new Date('2022-09-18T23:30:00+0100');

    //                             -18T23:30:00 UTC
    const end   = new Date('2022-09-19T00:30:00+0100'); // prettier-ignore

    const component = mountWithTheme(<DateRange start={start} end={end} />);
    expect(component.html()).toEqual(
      '<time datetime="2022-09-18T22:30:00.000Z">18 September 2022</time> – ' +
        '<time datetime="2022-09-18T23:30:00.000Z">19 September 2022</time>'
    );
  });
});
