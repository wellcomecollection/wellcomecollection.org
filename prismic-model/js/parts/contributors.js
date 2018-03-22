import structuredText from './structured-text';

const contributors = {
  'type': 'Group',
  'fieldset': 'Contributors',
  'config': {
    'fields': {
      'role': {
        'type': 'Link',
        'config': {
          'label': 'Role',
          'select': 'document',
          'customtypes': [ 'editorial-contributor-roles' ]
        }
      },
      'contributor': {
        'type': 'Link',
        'config': {
          'label': 'Contributor',
          'select': 'document',
          'customtypes': [ 'people', 'organisations' ]
        }
      },
      'description': structuredText('How did they contribute to this?')
    }
  }
};

export default contributors;
