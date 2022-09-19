import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import DateRange from './DateRange';

describe('DateRange', () => {
  it('renders a date + time range if the start/end are on the same day', () => {
    const start = new Date('2022-09-18T12:00:00+0100');
    const end = new Date('2022-09-18T14:30:00+0100');

    const component = mountWithTheme(<DateRange start={start} end={end} />);
    expect(component.html()).toEqual(
      '<time datetime="2022-09-18T11:00:00.000Z">Sunday 18 September 2022</time>, ' +
        '<span><time datetime="2022-09-18T11:00:00.000Z">12:00</time> – <time datetime="2022-09-18T13:30:00.000Z">14:30</time></span>'
    );
  });

  it('renders a date range if the start/end are on different days', () => {
    const start = new Date('2022-09-18T12:00:00+0100');
    const end = new Date('2022-09-25T12:00:00+0100');

    const component = mountWithTheme(<DateRange start={start} end={end} />);
    expect(component.html()).toEqual(
      '<time datetime="2022-09-18T11:00:00.000Z">18 September 2022</time> – ' +
        '<time datetime="2022-09-25T11:00:00.000Z">25 September 2022</time>'
    );
  });

  it('can split a date/time across multiple lines', () => {
    const start = new Date('2022-09-18T12:00:00+0100');
    const end = new Date('2022-09-18T14:30:00+0100');

    const component = mountWithTheme(
      <DateRange start={start} end={end} splitTime={true} />
    );
    expect(component.html()).toEqual(
      '<time datetime="2022-09-18T11:00:00.000Z">Sunday 18 September 2022</time>' +
        '<span class="block"><time datetime="2022-09-18T11:00:00.000Z">12:00</time> – <time datetime="2022-09-18T13:30:00.000Z">14:30</time></span>'
    );
  });
});
