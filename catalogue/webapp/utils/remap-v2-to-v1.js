// @flow
// An invaluable tool to do this:
// https://codebeautify.org/file-diff
export function remapV2ToV1(result: Object): Object {
  result.creators = result.contributors.map(contributor => {
    return {
      label: contributor.agent.label,
      type: 'Agent'
    };
  });

  result.identifiers = result.identifiers.map(identifier => {
    return {
      identifierScheme: identifier.identifierType.id,
      value: identifier.value,
      type: identifier.type
    };
  });

  // there's some difference here, but it doens't matter.
  result.subjects = result.subjects.map(concept => concept);

  if (result.thumbnail) {
    result.thumbnail = Object.assign({}, result.thumbnail, {
      locationType: result.thumbnail.locationType.id
    });
    result.thumbnail.license.licenseType = result.thumbnail.license.id.toUpperCase();
  }

  result.items = result.items.map(item => {
    item.identifiers = item.identifiers.map(identifier => {
      return {
        identifierScheme: identifier.identifierType.id,
        value: identifier.value,
        type: identifier.type
      };
    });
    item.locations = item.locations.map(location => {
      location.locationType = location.locationType.id;
      if (location.license) {
        location.license.licenseType = result.thumbnail.license.id.toUpperCase();
      }
      return location;
    });
    return item;
  });

  if (!result.items || result.items.length === 0) {
    result.items = [{
      'id': 'jv63hwvw',
      'identifiers': [
        {
          'identifierScheme': 'miro-image-number',
          'value': 'B0008326',
          'type': 'Identifier'
        }
      ],
      'locations': [
        {
          'locationType': 'iiif-image',
          'url': 'https://iiif.wellcomecollection.org/image/prismic:a448da91-41b1-435d-a00f-9e1e11588553_blank+image.jpg/info.json',
          'credit': 'David Linstead',
          'license': {
            'licenseType': 'CC-BY',
            'label': 'Attribution 4.0 International (CC BY 4.0)',
            'url': 'http://creativecommons.org/licenses/by/4.0/',
            'type': 'License'
          },
          'type': 'DigitalLocation'
        }
      ],
      'type': 'Item'
    }];
  }

  if (!result.thumbnail) {
    result.thumbnail = {
      'locationType': 'thumbnail-image',
      'url': 'https://iiif.wellcomecollection.org/image/prismic:a448da91-41b1-435d-a00f-9e1e11588553_blank+image.jpg/full/300,/0/default.jpg',
      'license': {
        'licenseType': 'CC-BY',
        'label': 'Attribution 4.0 International (CC BY 4.0)',
        'url': 'http://creativecommons.org/licenses/by/4.0/',
        'type': 'License'
      },
      'type': 'DigitalLocation'
    };
  }

  return result;
}
