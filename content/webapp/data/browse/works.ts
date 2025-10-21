import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';

// Helper function to generate dummy work data
const generateDummyWork = (
  id: number,
  title: string,
  contributor: string,
  date: string,
  workType: string
): WorkBasic => ({
  id: `work-${id}`,
  title,
  productionDates: [date],
  cardLabels: [{ text: workType }],
  primaryContributorLabel: contributor,
  notes: [],
});

// Generate dummy works for different sub-types
export const dummyWorksBySubType: Record<string, WorkBasic[]> = {
  // Books sub-types
  biographies: [
    generateDummyWork(
      1,
      'Life and Letters of Charles Darwin',
      'Francis Darwin',
      '1887',
      'Book'
    ),
    generateDummyWork(
      2,
      'The Life of Florence Nightingale',
      'Edward Cook',
      '1913',
      'Book'
    ),
    generateDummyWork(
      3,
      'Joseph Lister: His Life and Work',
      'Richard Godlee',
      '1917',
      'Book'
    ),
    generateDummyWork(
      4,
      'Madame Curie: A Biography',
      'Eve Curie',
      '1937',
      'Book'
    ),
    generateDummyWork(
      5,
      'The Life of Sir William Osler',
      'Harvey Cushing',
      '1925',
      'Book'
    ),
    generateDummyWork(
      6,
      'Louis Pasteur: Free Lance of Science',
      'René Dubos',
      '1950',
      'Book'
    ),
    generateDummyWork(
      7,
      'The Double Helix',
      'James Watson',
      '1968',
      'Book'
    ),
    generateDummyWork(
      8,
      'Rosalind Franklin: The Dark Lady of DNA',
      'Brenda Maddox',
      '2002',
      'Book'
    ),
    generateDummyWork(
      9,
      'A Life in Medicine',
      'Robert Coles',
      '1991',
      'Book'
    ),
    generateDummyWork(
      10,
      'The Immortal Life of Henrietta Lacks',
      'Rebecca Skloot',
      '2010',
      'Book'
    ),
  ],
  zines: [
    generateDummyWork(
      11,
      'AIDS Treatment News',
      'John James',
      '1986',
      'Zine'
    ),
    generateDummyWork(
      12,
      'Fat Girl: A Zine for Fat Dykes',
      'Max Airborne',
      '1994',
      'Zine'
    ),
    generateDummyWork(
      13,
      'Doris: An Archaeology of Everyday Life',
      'Cindy Crabb',
      '1991',
      'Zine'
    ),
    generateDummyWork(
      14,
      'Mind the Gap: Mental Health Zine',
      'Various',
      '2005',
      'Zine'
    ),
    generateDummyWork(
      15,
      'Sick: A Cultural History of Illness Zine',
      'Anonymous',
      '2008',
      'Zine'
    ),
    generateDummyWork(
      16,
      'Disability Rag',
      'Mary Johnson',
      '1982',
      'Zine'
    ),
    generateDummyWork(
      17,
      'Hysteria: Women and Mental Health',
      'Collective',
      '1998',
      'Zine'
    ),
    generateDummyWork(
      18,
      'The Body Positive',
      'Connie Sobczak',
      '1996',
      'Zine'
    ),
    generateDummyWork(
      19,
      'Sickly Zine',
      'Various',
      '2012',
      'Zine'
    ),
    generateDummyWork(
      20,
      'Chronic Illness Cat',
      'Anonymous',
      '2015',
      'Zine'
    ),
  ],
  academic: [
    generateDummyWork(
      21,
      'Principles and Practice of Medicine',
      'William Osler',
      '1892',
      'Book'
    ),
    generateDummyWork(
      22,
      'On the Origin of Species',
      'Charles Darwin',
      '1859',
      'Book'
    ),
    generateDummyWork(
      23,
      'An Inquiry into the Causes of the Late Increase of Robbers',
      'Henry Fielding',
      '1751',
      'Book'
    ),
    generateDummyWork(
      24,
      'A Treatise on the Scurvy',
      'James Lind',
      '1753',
      'Book'
    ),
    generateDummyWork(
      25,
      'The Morbid Anatomy of Some of the Most Important Parts',
      'Matthew Baillie',
      '1793',
      'Book'
    ),
    generateDummyWork(
      26,
      'Cellular Pathology',
      'Rudolf Virchow',
      '1858',
      'Book'
    ),
    generateDummyWork(
      27,
      'The Principles of Psychology',
      'William James',
      '1890',
      'Book'
    ),
    generateDummyWork(
      28,
      'The Interpretation of Dreams',
      'Sigmund Freud',
      '1899',
      'Book'
    ),
    generateDummyWork(
      29,
      'Anatomia Corporis Humani',
      'Govard Bidloo',
      '1685',
      'Book'
    ),
    generateDummyWork(
      30,
      'De Humani Corporis Fabrica',
      'Andreas Vesalius',
      '1543',
      'Book'
    ),
  ],

  // Archive sub-types
  'personal-papers': [
    generateDummyWork(
      101,
      'Papers of Marie Curie',
      'Marie Curie',
      '1890-1934',
      'Archive'
    ),
    generateDummyWork(
      102,
      'Papers of Alexander Fleming',
      'Alexander Fleming',
      '1920-1955',
      'Archive'
    ),
    generateDummyWork(
      103,
      'Papers of Dorothy Hodgkin',
      'Dorothy Hodgkin',
      '1930-1994',
      'Archive'
    ),
    generateDummyWork(
      104,
      'Papers of Francis Crick',
      'Francis Crick',
      '1947-2004',
      'Archive'
    ),
    generateDummyWork(
      105,
      'Papers of Henry Wellcome',
      'Henry Wellcome',
      '1880-1936',
      'Archive'
    ),
    generateDummyWork(
      106,
      'Papers of Elizabeth Garrett Anderson',
      'Elizabeth Garrett Anderson',
      '1859-1917',
      'Archive'
    ),
    generateDummyWork(
      107,
      'Papers of Ronald Ross',
      'Ronald Ross',
      '1895-1932',
      'Archive'
    ),
    generateDummyWork(
      108,
      'Papers of John Snow',
      'John Snow',
      '1830-1858',
      'Archive'
    ),
    generateDummyWork(
      109,
      'Papers of Mary Seacole',
      'Mary Seacole',
      '1850-1881',
      'Archive'
    ),
    generateDummyWork(
      110,
      'Papers of Cicely Williams',
      'Cicely Williams',
      '1925-1988',
      'Archive'
    ),
  ],

  // Pictures sub-types
  photographs: [
    generateDummyWork(
      201,
      'Hospital ward during First World War',
      'Unknown',
      '1916',
      'Photograph'
    ),
    generateDummyWork(
      202,
      'X-ray of hand',
      'Wilhelm Röntgen',
      '1895',
      'Photograph'
    ),
    generateDummyWork(
      203,
      'Operating theatre at St Thomas Hospital',
      'Herbert Watkins',
      '1862',
      'Photograph'
    ),
    generateDummyWork(
      204,
      'Children being vaccinated',
      'Unknown',
      '1920',
      'Photograph'
    ),
    generateDummyWork(
      205,
      'Microscopic view of bacteria',
      'Robert Koch',
      '1884',
      'Photograph'
    ),
    generateDummyWork(
      206,
      'Florence Nightingale at Scutari',
      'Unknown',
      '1856',
      'Photograph'
    ),
    generateDummyWork(
      207,
      'DNA molecular model',
      'Science Museum',
      '1953',
      'Photograph'
    ),
    generateDummyWork(
      208,
      'Medical missionaries in China',
      'Unknown',
      '1905',
      'Photograph'
    ),
    generateDummyWork(
      209,
      'Anatomy demonstration',
      'Unknown',
      '1890',
      'Photograph'
    ),
    generateDummyWork(
      210,
      'Early surgical operation',
      'Unknown',
      '1902',
      'Photograph'
    ),
  ],

  // Public health sub-topics
  sanitation: [
    generateDummyWork(
      301,
      'Report on the Sanitary Condition of the Labouring Population',
      'Edwin Chadwick',
      '1842',
      'Book'
    ),
    generateDummyWork(
      302,
      'On the Mode of Communication of Cholera',
      'John Snow',
      '1849',
      'Book'
    ),
    generateDummyWork(
      303,
      'The Sanitary Condition of the City of London',
      'John Simon',
      '1854',
      'Report'
    ),
    generateDummyWork(
      304,
      'Notes on Nursing',
      'Florence Nightingale',
      '1859',
      'Book'
    ),
    generateDummyWork(
      305,
      'Water supply and sewerage of London',
      'Metropolitan Board of Works',
      '1865',
      'Report'
    ),
    generateDummyWork(
      306,
      'The Dangers of the Water Closet',
      'Various',
      '1870',
      'Pamphlet'
    ),
    generateDummyWork(
      307,
      'Public Health Acts and Regulations',
      'Parliament',
      '1875',
      'Legal document'
    ),
    generateDummyWork(
      308,
      'Typhoid and the Water Supply',
      'William Budd',
      '1873',
      'Book'
    ),
    generateDummyWork(
      309,
      'Refuse Disposal in Cities',
      'Samuel Rideal',
      '1898',
      'Book'
    ),
    generateDummyWork(
      310,
      'The Housing of the Working Classes',
      'Octavia Hill',
      '1883',
      'Book'
    ),
  ],

  'disease-outbreaks': [
    generateDummyWork(
      311,
      'A Journal of the Plague Year',
      'Daniel Defoe',
      '1722',
      'Book'
    ),
    generateDummyWork(
      312,
      'An Inquiry into the Causes of the Plague',
      'Richard Mead',
      '1720',
      'Book'
    ),
    generateDummyWork(
      313,
      'Observations on the Influenza of 1847-1848',
      'Theophilus Thompson',
      '1852',
      'Book'
    ),
    generateDummyWork(
      314,
      'The Great Scourge and How to End It',
      'Emmeline Pankhurst',
      '1913',
      'Book'
    ),
    generateDummyWork(
      315,
      'Pandemic Influenza 1918-1919',
      'Ministry of Health',
      '1920',
      'Report'
    ),
    generateDummyWork(
      316,
      'Smallpox and Vaccination',
      'Charles Creighton',
      '1889',
      'Book'
    ),
    generateDummyWork(
      317,
      'Yellow Fever: A Compilation',
      'George Sternberg',
      '1890',
      'Book'
    ),
    generateDummyWork(
      318,
      'The Prevention of Malaria',
      'Ronald Ross',
      '1910',
      'Book'
    ),
    generateDummyWork(
      319,
      'Tuberculosis: Its Nature and Treatment',
      'Robert Philip',
      '1907',
      'Book'
    ),
    generateDummyWork(
      320,
      'The Control of Communicable Diseases',
      'Haven Emerson',
      '1917',
      'Book'
    ),
  ],

  epidemiology: [
    generateDummyWork(
      321,
      'Vital Statistics',
      'William Farr',
      '1837-1880',
      'Report'
    ),
    generateDummyWork(
      322,
      'Statistical Nosology',
      'William Farr',
      '1839',
      'Book'
    ),
    generateDummyWork(
      323,
      'The Sanitary Condition of the Labouring Population',
      'Edwin Chadwick',
      '1842',
      'Report'
    ),
    generateDummyWork(
      324,
      'On the Principle of Medical Statistics',
      'Pierre Louis',
      '1835',
      'Book'
    ),
    generateDummyWork(
      325,
      'A Contribution to the Study of Epidemic Diphtheria',
      'Janet Lane-Claypon',
      '1909',
      'Report'
    ),
    generateDummyWork(
      326,
      'The Environment and Disease',
      'Austin Bradford Hill',
      '1962',
      'Book'
    ),
    generateDummyWork(
      327,
      'Statistical Methods in Medical Research',
      'Peter Armitage',
      '1971',
      'Book'
    ),
    generateDummyWork(
      328,
      'An Introduction to Epidemiology',
      'John Last',
      '1980',
      'Book'
    ),
    generateDummyWork(
      329,
      'Modern Epidemiology',
      'Kenneth Rothman',
      '1986',
      'Book'
    ),
    generateDummyWork(
      330,
      'Causal Inference in Statistics',
      'Judea Pearl',
      '2016',
      'Book'
    ),
  ],
};

// Helper to get works for a sub-type
export const getWorksForSubType = (
  subTypeId: string,
  limit: number = 10
): WorkBasic[] => {
  const works = dummyWorksBySubType[subTypeId] || [];
  return works.slice(0, limit);
};
