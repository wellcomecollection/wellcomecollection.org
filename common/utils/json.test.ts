import { deserialiseDates, removeUndefinedProps, serialiseDates } from './json';

describe('date serialisation', () => {
  it('serialises and deserialises instances of Date via JSON', () => {
    const value = {
      name: 'pentagon',
      sides: 5,
      colours: ['red', 'green', 'blue'],
      siblings: [
        { name: 'square', sides: 4 },
        { name: 'hexagon', sides: 6 },
      ],
      createdDate: new Date('2005-05-05T05:05:05Z'),
      significantDates: {
        birthday: {
          date: new Date('2006-06-06T06:06:06Z'),
        },
        discovery: {
          date: new Date('2007-07-07T07:07:07Z'),
        },
      },
      otherDates: [
        new Date('2008-08-08T08:08:08Z'),
        new Date('2009-09-09T09:09:09Z'),
      ],
      nonUTCDates: [
        new Date('2001-01-01T01:01:01+0100'),
        new Date('2002-02-02T02:02:02-0200'),
      ],
    };

    expect(deserialiseDates(serialiseDates(value))).toStrictEqual(value);
  });

  it('handles null values in the JSON', () => {
    const value = {
      name: 'the void',
      location: null,
    };

    expect(deserialiseDates(serialiseDates(value))).toStrictEqual(value);
  });
});

describe('removeUndefinedProps', () => {
  it('removes null and undefined values', () => {
    const obj = {
      thing: 'that exists',
      anotherThatIsNull: null,
      iAmUndefined: undefined,
    };

    const emptiedObject = removeUndefinedProps(obj);

    expect(emptiedObject).toStrictEqual({
      thing: 'that exists',
    });
  });

  it('removes null and undefined values from nested objects', () => {
    const obj = {
      thing: 'that exists',
      innerObject: {
        thing: 'that exists inside the other thing',
        anotherThatIsNull: null,
        iAmUndefined: undefined,
      },
      innerArray: [
        {
          thing: 'that is in a list of other things',
          anotherThatIsNull: null,
          iAmUndefined: undefined,
        },
      ],
    };

    const emptiedObject = removeUndefinedProps(obj);

    expect(emptiedObject).toStrictEqual({
      thing: 'that exists',
      innerObject: {
        thing: 'that exists inside the other thing',
      },
      innerArray: [
        {
          thing: 'that is in a list of other things',
        },
      ],
    });
  });
});
