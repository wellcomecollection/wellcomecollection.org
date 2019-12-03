// @flow

import {
  getProductionDates,
  getItemsWith,
  getItemIdentifiersWith,
  getWorkIdentifiersWith,
} from '../../utils/works';
import { WorkFixture } from '../fixtures/catalogueApi/work';

describe('getProductionDates', () => {
  it('should extract date labels from a work', () => {
    const dateLabel = getProductionDates(WorkFixture);

    expect(dateLabel).toStrictEqual(['[between 1990 and 1999?]']);
  });
});

describe('getItemsWith', () => {
  it('gets the items with indicated by the parameters', () => {
    const items = getItemsWith(WorkFixture, {
      identifierId: 'sierra-system-number',
      locationType: 'PhysicalLocation',
    });

    expect(items.length).toBe(1);
    expect(items[0].id).toBe('ys3ern6x');
  });
});

describe('getWorkIdentifiersWith', () => {
  it('should get the work identifiers indicated by the parameters', () => {
    const identifiers = getWorkIdentifiersWith(
      WorkFixture,
      {
        identifierId: 'sierra-system-number',
      },
    );

    expect(identifiers.length).toBe(1);
    expect(identifiers[0]).toBe('b16656180');  
  });
});

describe('getItemIdentifiersWith', () => {
  it('gets the item identifiers indicated by the parameters', () => {
    const identifiers = getItemIdentifiersWith(
      WorkFixture,
      {
        identifierId: 'sierra-system-number',
        locationType: 'PhysicalLocation',
      },
      'sierra-system-number'
    );

    expect(identifiers.length).toBe(1);
    expect(identifiers[0]).toBe('i16010176');
  });
});
