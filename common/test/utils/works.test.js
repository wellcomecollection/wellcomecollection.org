// @flow

import {
  getProductionDates,
  getItemsWith,
  getItemIdentifiersWith,
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

describe('getItemIdentifiersWith', () => {
  it('gets the item identifiers indicated by the parameters', () => {
    const items = getItemIdentifiersWith(
      WorkFixture,
      {
        identifierId: 'sierra-system-number',
        locationType: 'PhysicalLocation',
      },
      'sierra-system-number'
    );

    expect(items.length).toBe(1);
    expect(items[0]).toBe('i16010176');
  });
});
