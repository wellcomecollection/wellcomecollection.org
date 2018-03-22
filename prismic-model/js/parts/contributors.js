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
      }
    }
  }
};

export default contributors;
