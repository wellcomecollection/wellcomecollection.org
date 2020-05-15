import { storiesOf } from '@storybook/react';
import ArchiveTree from '../../../common/views/components/ArchiveTree/ArchiveTree';
// import Readme from '../../../common/views/components/ArchiveTree/README.md';

const stories = storiesOf('Components', module);

const ArchiveTreeExample = () => {
  return (
    <ArchiveTree
      collection={[
        {
          path: {
            path: 'PPCRI',
            level: 'Collection',
            label: 'PP/CRI',
            type: 'CollectionPath',
          },
          work: {
            id: 'hz43r7re',
            title: 'Francis Crick (1916-2004): archives',
            alternativeTitles: [],
            type: 'Work',
          },
          children: [
            {
              path: {
                path: 'PPCRI/A',
                level: 'Section',
                label: 'PP/CRI/A',
                type: 'CollectionPath',
              },
              work: {
                id: 'we4g7bbz',
                title: 'Personal Material',
                alternativeTitles: [],
                type: 'Work',
              },
              children: [
                {
                  path: {
                    path: 'PPCRI/A',
                    level: 'Section',
                    label: 'PP/CRI/A',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'we4g7bbz',
                    title: 'Test Personal Material',
                    alternativeTitles: [],
                    type: 'Work',
                  },
                },
                {
                  path: {
                    path: 'PPCRI/A',
                    level: 'Section',
                    label: 'PP/CRI/A',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'we4g7bbz',
                    title: 'Test Personal Material',
                    alternativeTitles: [],
                    type: 'Work',
                  },
                  children: [
                    {
                      path: {
                        path: 'PPCRI/A',
                        level: 'Section',
                        label: 'PP/CRI/A',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'we4g7bbz',
                        title: 'Test2 Personal Material',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                      children: [
                        {
                          path: {
                            path: 'PPCRI/A',
                            level: 'Section',
                            label: 'PP/CRI/A',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'we4g7bbz',
                            title: 'Test3 Personal Material',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                      ],
                    },
                    {
                      path: {
                        path: 'PPCRI/A',
                        level: 'Section',
                        label: 'PP/CRI/A',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'we4g7bbz',
                        title: 'Test2 Personal Material',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A',
                        level: 'Section',
                        label: 'PP/CRI/A',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'we4g7bbz',
                        title: 'Test2 Personal Material',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                  ],
                },
                {
                  path: {
                    path: 'PPCRI/A',
                    level: 'Section',
                    label: 'PP/CRI/A',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'we4g7bbz',
                    title: 'Test Personal Material',
                    alternativeTitles: [],
                    type: 'Work',
                  },
                },
              ],
            },
            {
              path: {
                path: 'PPCRI/B',
                level: 'Section',
                label: 'PP/CRI/B',
                type: 'CollectionPath',
              },
              work: {
                id: 'u8wg83kb',
                title: 'Medical Research Council',
                alternativeTitles: [],
                type: 'Work',
              },
            },
            {
              path: {
                path: 'PPCRI/C',
                level: 'Section',
                label: 'PP/CRI/C',
                type: 'CollectionPath',
              },
              work: {
                id: 'zngeejpx',
                title: 'Salk Institute for Biological Studies',
                alternativeTitles: [],
                type: 'Work',
              },
            },
            {
              path: {
                path: 'PPCRI/D',
                level: 'Section',
                label: 'PP/CRI/D',
                type: 'CollectionPath',
              },
              work: {
                id: 'rcv2reyj',
                title: 'Correspondence',
                alternativeTitles: [],
                type: 'Work',
              },
            },
            {
              path: {
                path: 'PPCRI/E',
                level: 'Section',
                label: 'PP/CRI/E',
                type: 'CollectionPath',
              },
              work: {
                id: 'sse7geug',
                title: 'Travels and Meetings',
                alternativeTitles: [],
                type: 'Work',
              },
            },
            {
              path: {
                path: 'PPCRI/F',
                level: 'Section',
                label: 'PP/CRI/F',
                type: 'CollectionPath',
              },
              work: {
                id: 'n4vmzs9j',
                title: 'Doctorate',
                alternativeTitles: [],
                type: 'Work',
              },
            },
            {
              path: {
                path: 'PPCRI/G',
                level: 'Section',
                label: 'PP/CRI/G',
                type: 'CollectionPath',
              },
              work: {
                id: 'edf9m6n4',
                title: 'Notebooks',
                alternativeTitles: [],
                type: 'Work',
              },
            },
            {
              path: {
                path: 'PPCRI/J',
                level: 'Section',
                label: 'PP/CRI/J',
                type: 'CollectionPath',
              },
              work: {
                id: 'u9aq34kg',
                title: 'Correspondence 1976-2004',
                alternativeTitles: [],
                type: 'Work',
              },
            },
            {
              path: {
                path: 'PPCRI/K',
                level: 'Section',
                label: 'PP/CRI/K',
                type: 'CollectionPath',
              },
              work: {
                id: 'kwc2vjhf',
                title: 'Travel and Lectures 1982-2004',
                alternativeTitles: [],
                type: 'Work',
              },
            },
            {
              path: {
                path: 'PPCRI/L',
                level: 'Section',
                label: 'PP/CRI/L',
                type: 'CollectionPath',
              },
              work: {
                id: 'pruqx8fm',
                title: 'Notes, Drafts and Models [1976]-2004',
                alternativeTitles: [],
                type: 'Work',
              },
            },
            {
              path: {
                path: 'PPCRI/M',
                level: 'Section',
                label: 'PP/CRI/M',
                type: 'CollectionPath',
              },
              work: {
                id: 'd9r2ahvy',
                title: 'Publications 1950-2001',
                alternativeTitles: [],
                type: 'Work',
              },
            },
          ],
        },
      ]}
    />
  );
};

stories.add('Archive Tree', ArchiveTreeExample, {
  // readme: { sidebar: Readme },
});
