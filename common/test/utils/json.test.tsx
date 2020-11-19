import { removeEmptyProps, removeUndefinedProps } from '../../utils/json';

describe('removeEmptyProps', () => {
  it('should remove null and undefined values', () => {
    const obj = {
      thing: 'that exists',
      anotherThatIsNull: null,
      iAmUndefined: undefined,
    };

    const emptiedObject = removeEmptyProps(obj);

    expect(emptiedObject.thing).toBe('that exists');
    expect(emptiedObject.anotherThatIsNull).toBeUndefined();
    expect(emptiedObject.iAmUndefined).toBeUndefined();
  });
});

describe('removeUndefinedProps', () => {
  it('should remove null and undefined values', () => {
    const obj = {
      thing: 'that exists',
      anotherThatIsNull: null,
      iAmUndefined: undefined,
    };

    const emptiedObject = removeUndefinedProps(obj);

    expect(emptiedObject.thing).toBe('that exists');
    expect(emptiedObject.anotherThatIsNull).toBeNull();
    expect(emptiedObject.iAmUndefined).toBeUndefined();
  });
});
