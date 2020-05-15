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
                    path: 'PPCRI/A/1',
                    level: 'Section',
                    label: 'PP/CRI/A/1',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'cuqy8s4v',
                    title: 'Miscellaneous Personal Items',
                    alternativeTitles: [],
                    type: 'Work',
                  },
                  children: [
                    {
                      path: {
                        path: 'PPCRI/A/1/1',
                        level: 'Item',
                        label: 'PP/CRI/A/1/1',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'fmbrjngy',
                        title: 'Fingerprints',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                      children: [],
                    },
                    {
                      path: {
                        path: 'PPCRI/A/1/2',
                        level: 'Series',
                        label: 'PP/CRI/A/1/2',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'suv8jpjk',
                        title: 'Miscellaneous Photographs',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                      children: [
                        {
                          path: {
                            path: 'PPCRI/A/1/2/1',
                            level: 'Item',
                            label: 'PP/CRI/A/1/2/1',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 't5dma67c',
                            title:
                              'Physics Research Students, Cavendish Laboratory',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                          children: [],
                        },
                        {
                          path: {
                            path: 'PPCRI/A/1/2/2',
                            level: 'Item',
                            label: 'PP/CRI/A/1/2/2',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'nuku649g',
                            title: 'Group Portrait, Gordon Research Conference',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                          children: [],
                        },
                        {
                          path: {
                            path: 'PPCRI/A/1/2/3',
                            level: 'Item',
                            label: 'PP/CRI/A/1/2/3',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'zw6gs7ae',
                            title: 'Group Portrait, Gordon Research Conference',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                        {
                          path: {
                            path: 'PPCRI/A/1/2/4',
                            level: 'Item',
                            label: 'PP/CRI/A/1/2/4',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'b5ufy8am',
                            title:
                              'Crick at The Weizmann Institute of Science, Rehovoth, Israel',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                        {
                          path: {
                            path: 'PPCRI/A/1/2/5',
                            level: 'Item',
                            label: 'PP/CRI/A/1/2/5',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'dxpe4yg5',
                            title: 'Crick, Onsager, Dirac and Lamb',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                        {
                          path: {
                            path: 'PPCRI/A/1/2/6',
                            level: 'Item',
                            label: 'PP/CRI/A/1/2/6',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'p5cnsf4z',
                            title: 'National Geographic Society Portrait',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                        {
                          path: {
                            path: 'PPCRI/A/1/2/7',
                            level: 'Item',
                            label: 'PP/CRI/A/1/2/7',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'x59nqwn7',
                            title: 'Crick Lecturing (Composite Image)',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                        {
                          path: {
                            path: 'PPCRI/A/1/2/8',
                            level: 'Item',
                            label: 'PP/CRI/A/1/2/8',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'ujpjhrga',
                            title: 'Wall Graffiti',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                        {
                          path: {
                            path: 'PPCRI/A/1/2/9',
                            level: 'Item',
                            label: 'PP/CRI/A/1/2/9',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'wx78fayt',
                            title: 'Crick Lecturing',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                      ],
                    },
                    {
                      path: {
                        path: 'PPCRI/A/1/3',
                        level: 'Item',
                        label: 'PP/CRI/A/1/3',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'sfvruhek',
                        title: 'Pension',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                      children: [],
                    },
                    {
                      path: {
                        path: 'PPCRI/A/1/4',
                        level: 'Item',
                        label: 'PP/CRI/A/1/4',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'wt88px9z',
                        title: 'Miscellaneous Press Cuttings',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                      children: [],
                    },
                    {
                      path: {
                        path: 'PPCRI/A/1/5',
                        level: 'Item',
                        label: 'PP/CRI/A/1/5',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'fymc8dys',
                        title: 'Greetings Cards and Postcards',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                      children: [],
                    },
                    {
                      path: {
                        path: 'PPCRI/A/1/6',
                        level: 'Series',
                        label: 'PP/CRI/A/1/6',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'u9m4dgw4',
                        title: 'Family',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                      children: [
                        {
                          path: {
                            path: 'PPCRI/A/1/6/1',
                            level: 'Item',
                            label: 'PP/CRI/A/1/6/1',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'scp2qt2z',
                            title: 'Arthur Crick',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                        {
                          path: {
                            path: 'PPCRI/A/1/6/2',
                            level: 'Item',
                            label: 'PP/CRI/A/1/6/2',
                            type: 'CollectionPath',
                          },
                          work: {
                            id: 'vd38k3wz',
                            title: '[Shoe-making]',
                            alternativeTitles: [],
                            type: 'Work',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  path: {
                    path: 'PPCRI/A/2',
                    level: 'Section',
                    label: 'PP/CRI/A/2',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'ngs77qwh',
                    title: 'Correspondence',
                    alternativeTitles: [],
                    type: 'Work',
                  },
                  children: [
                    {
                      path: {
                        path: 'PPCRI/A/2/1',
                        level: 'Item',
                        label: 'PP/CRI/A/2/1',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'v83fwe6a',
                        title: 'MRC: Studentship and Employment Correspondence',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/2/2',
                        level: 'Item',
                        label: 'PP/CRI/A/2/2',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'vhmkd8rd',
                        title: "<i>Who's Who</i>",
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/2/3',
                        level: 'Item',
                        label: 'PP/CRI/A/2/3',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'tn3v3r9a',
                        title: 'National Academy of Sciences',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/2/4',
                        level: 'Item',
                        label: 'PP/CRI/A/2/4',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'sn8pmhm8',
                        title: 'Medical Research Council',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/2/5',
                        level: 'Item',
                        label: 'PP/CRI/A/2/5',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'sp2uddqr',
                        title: 'Personal Letters',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                  ],
                },
                {
                  path: {
                    path: 'PPCRI/A/3',
                    level: 'Section',
                    label: 'PP/CRI/A/3',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'vf22uawj',
                    title: 'Prizes and Honours',
                    alternativeTitles: [],
                    type: 'Work',
                  },
                  children: [
                    {
                      path: {
                        path: 'PPCRI/A/3/1',
                        level: 'Series',
                        label: 'PP/CRI/A/3/1',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'pcwnggv2',
                        title: 'Nobel Foundation',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/3/2',
                        level: 'Series',
                        label: 'PP/CRI/A/3/2',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'dga3da9m',
                        title: 'The Royal Society',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/3/3',
                        level: 'Series',
                        label: 'PP/CRI/A/3/3',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'qusct555',
                        title: 'Prix Charles-Léopold Mayer',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/3/4',
                        level: 'Item',
                        label: 'PP/CRI/A/3/4',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'upv95mte',
                        title: 'Gairdner Foundation',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/3/5',
                        level: 'Item',
                        label: 'PP/CRI/A/3/5',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'mt6jshap',
                        title: 'Deutsche Akademie der Naturforscher Leopoldina',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/3/6',
                        level: 'Item',
                        label: 'PP/CRI/A/3/6',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'jtpjefr2',
                        title: 'Other Awards',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/3/7',
                        level: 'Item',
                        label: 'PP/CRI/A/3/7',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'vndvmjgf',
                        title: 'Antonio Feltrinelli Prize (Brenner and Huxley)',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                  ],
                },
                {
                  path: {
                    path: 'PPCRI/A/4',
                    level: 'Section',
                    label: 'PP/CRI/A/4',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'fceh39hu',
                    title: 'Cetus Corporation',
                    alternativeTitles: [],
                    type: 'Work',
                  },
                  children: [
                    {
                      path: {
                        path: 'PPCRI/A/4/2',
                        level: 'Item',
                        label: 'PP/CRI/A/4/2',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'd87vdzm7',
                        title: '[About Cetus]',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/4/3',
                        level: 'Item',
                        label: 'PP/CRI/A/4/3',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'j3vckfnv',
                        title: 'Communication with Shareholders',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/4/4',
                        level: 'Item',
                        label: 'PP/CRI/A/4/4',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'vtaps286',
                        title: 'Correspondence: Consultancy',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/4/5',
                        level: 'Item',
                        label: 'PP/CRI/A/4/5',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'bgbhp4yj',
                        title: 'Scientific Meeting II',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/A/4/6',
                        level: 'Item',
                        label: 'PP/CRI/A/4/6',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'cfgyn6ff',
                        title: 'Scientific Meeting III',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                  ],
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
              children: [
                {
                  path: {
                    path: 'PPCRI/B/2',
                    level: 'Section',
                    label: 'PP/CRI/B/2',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'rdj63myz',
                    title: 'Reports',
                    alternativeTitles: [],
                    type: 'Work',
                  },
                  children: [
                    {
                      path: {
                        path: 'PPCRI/B/2/1',
                        level: 'Item',
                        label: 'PP/CRI/B/2/1',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'ex86kt6j',
                        title: 'MRC: "Report of the Klampenborg Conference"',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/B/2/3',
                        level: 'Item',
                        label: 'PP/CRI/B/2/3',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'ma7388yn',
                        title:
                          '"Report to the Medical Research Council" (1971)',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                    {
                      path: {
                        path: 'PPCRI/B/2/4',
                        level: 'Item',
                        label: 'PP/CRI/B/2/4',
                        type: 'CollectionPath',
                      },
                      work: {
                        id: 'tsk6ftky',
                        title:
                          '"Report to the Medical Research Council" (1975)',
                        alternativeTitles: [],
                        type: 'Work',
                      },
                    },
                  ],
                },
                {
                  path: {
                    path: 'PPCRI/B/3',
                    level: 'Section',
                    label: 'PP/CRI/B/3',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'b5hsn8mt',
                    title: 'Wooster Machine',
                    alternativeTitles: [],
                    type: 'Work',
                  },
                },
                {
                  path: {
                    path: 'PPCRI/B/4',
                    level: 'Item',
                    label: 'PP/CRI/B/4',
                    type: 'CollectionPath',
                  },
                  work: {
                    id: 'awj3csre',
                    title: "'Francis Crick's 2 x 2 Cambridge Slides'",
                    alternativeTitles: [],
                    type: 'Work',
                  },
                },
              ],
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
              children: [],
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
              children: [],
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
              children: [],
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
              children: [],
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
              children: [],
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
              children: [],
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
              children: [],
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
              children: [],
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
              children: [],
            },
            {
              path: {
                path: 'PPCRI/N',
                level: 'Section',
                label: 'PP/CRI/N',
                type: 'CollectionPath',
              },
              work: {
                id: 'y5dbtbxg',
                title: 'Societies',
                alternativeTitles: [],
                type: 'Work',
              },
              children: [],
            },
          ],
        },
      ]}
      currentWork="b5ufy8am"
    />
  );
};

stories.add('Archive Tree', ArchiveTreeExample, {
  // readme: { sidebar: Readme },
});
