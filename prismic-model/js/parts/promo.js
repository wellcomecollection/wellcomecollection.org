// @flow
export default {
  'type': 'Slices',
  'config': {
    'label': 'Promo',
    'choices': {
      'editorialImage': {
        'type': 'Slice',
        'fieldset': 'Editorial image',
        'config': {
          'label': 'Editorial image'
        },
        'non-repeat': {
          'caption': {
            'type': 'StructuredText',
            'config': {
              'label': 'Promo text',
              'single': 'paragraph'
            }
          },
          'image': {
            'type': 'Image',
            'config': {
              'label': 'Promo image',
              'thumbnails': [ {
                'name': '32:15',
                'width': 3200,
                'height': 1500
              }, {
                'name': '16:9',
                'width': 3200,
                'height': 1800
              }, {
                'name': 'square',
                'width': 3200,
                'height': 3200
              } ]
            }
          }
        }
      }
    }
  }
};
