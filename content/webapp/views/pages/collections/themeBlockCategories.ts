// Theme block categories config for collections landing page
// TODO need the real concept ids to use

export type ThemeCategory = {
  label: string;
  concepts: string[];
};

export type ThemeConfig = {
  categories: ThemeCategory[];
};

export const themeBlockCategories: ThemeConfig = {
  categories: [
    {
      label: 'Featured',
      concepts: ['s7d7wjf3', 'gyh3qjn3', 'kd6svu9u', 'uxms5dmz'],
    },
    {
      label: 'People and organisations',
      concepts: ['a224b9mp', 'a223f5a6', 'a2249bxm'],
    },
    {
      label: 'Techniques',
      concepts: ['a224tns9', 'uxms5dmz'],
    },
    {
      label: 'Subjects',
      concepts: ['a224tns9', 'gyh3qjn3', 'rxa2pk4j'],
    },
    {
      label: 'Places',
      concepts: ['a224tns9', 's7d7wjf3'],
    },
  ],
};
