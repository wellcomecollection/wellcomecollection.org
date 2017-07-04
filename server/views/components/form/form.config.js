export const context = {
  fieldsets: [
    {
      heading: 'Sort by',
      elements: [
        {
          id: 'sort-by-oldest',
          type: 'radio',
          name: 'sort-by',
          label: 'Oldest first'
        },
        {
          id: 'sort-by-newest',
          type: 'radio',
          name: 'sort-by',
          label: 'Newest first'
        },
        {
          id: 'sort-by-match',
          type: 'radio',
          name: 'sort-by',
          label: 'Best match'
        }
      ]
    },
    {
      heading: 'License',
      elements: [
        {
          id: 'licence-rights',
          type: 'checkbox',
          name: 'license',
          label: 'Rights managed'
        },
        {
          id: 'licence-free',
          type: 'checkbox',
          name: 'license',
          label: 'Free'
        }
      ]
    },
    {
      heading: 'Orientation',
      elements: [
        {
          id: 'orientation-landscape',
          type: 'checkbox',
          name: 'orientation',
          label: 'Landscape'
        },
        {
          id: 'orientation-portrait',
          type: 'checkbox',
          name: 'orientation',
          label: 'Portrait'
        },
        {
          id: 'orientation-square',
          type: 'checkbox',
          name: 'orientation',
          label: 'Square'
        }
      ]
    }
  ],
  buttonText: 'Apply'
};
