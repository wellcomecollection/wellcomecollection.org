import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import { Image } from '@weco/content/services/wellcome/catalogue/types';

import ConceptCompositeImage from './ConceptCompositeImage';

// Fetch images for a concept from production API
const fetchConceptImages = async (
  conceptId: string,
  options: {
    includeContributors: boolean;
    includeSubjects: boolean;
    includeGenres: boolean;
    includeQuery: boolean;
    preferPortrait: boolean;
  }
): Promise<Image[]> => {
  try {
    // First, fetch the concept details to get its label for genre search
    const conceptResponse = await fetch(
      `https://api.wellcomecollection.org/catalogue/v2/concepts/${conceptId}`
    );
    const conceptData = await conceptResponse.json();
    const conceptLabel = conceptData.label || '';

    const allImages: Image[] = [];

    // Build array of fetch promises based on enabled options
    const fetchPromises: Promise<Response>[] = [];
    const fetchTypes: string[] = [];

    if (options.includeContributors) {
      fetchPromises.push(
        fetch(
          `https://api.wellcomecollection.org/catalogue/v2/images?source.contributors.agent=${conceptId}&pageSize=10`
        )
      );
      fetchTypes.push('contributors');
    }

    if (options.includeSubjects) {
      fetchPromises.push(
        fetch(
          `https://api.wellcomecollection.org/catalogue/v2/images?source.subjects=${conceptId}&pageSize=10`
        )
      );
      fetchTypes.push('subjects');
    }

    if (options.includeGenres) {
      fetchPromises.push(
        fetch(
          `https://api.wellcomecollection.org/catalogue/v2/images?source.genres.label=${encodeURIComponent(
            conceptLabel
          )}&pageSize=10`
        )
      );
      fetchTypes.push('genres');
    }

    if (options.includeQuery && conceptLabel) {
      fetchPromises.push(
        fetch(
          `https://api.wellcomecollection.org/catalogue/v2/images?query=${encodeURIComponent(
            conceptLabel
          )}&pageSize=15`
        )
      );
      fetchTypes.push('query');
    }

    if (fetchPromises.length === 0) {
      return allImages; // No endpoints selected
    }

    // Execute all selected API calls
    const responses = await Promise.all(fetchPromises);
    const results = await Promise.all(responses.map(r => r.json()));

    // Process each result set
    const imageSets: { [key: string]: Image[] } = {};

    for (let i = 0; i < fetchTypes.length; i++) {
      const fetchType = fetchTypes[i];
      const data = results[i];
      imageSets[fetchType] = data.results || [];
    }

    // Handle genre alternative labels fallback if needed
    if (
      options.includeGenres &&
      imageSets.genres &&
      imageSets.genres.length === 0 &&
      conceptData.alternativeLabels
    ) {
      for (const altLabel of conceptData.alternativeLabels) {
        const altGenreResponse = await fetch(
          `https://api.wellcomecollection.org/catalogue/v2/images?source.genres.label=${encodeURIComponent(
            altLabel
          )}&pageSize=10`
        );
        const altGenreData = await altGenreResponse.json();
        const altGenreResults = altGenreData.results || [];
        if (altGenreResults.length > 0) {
          imageSets.genres = altGenreResults;
          break; // Use first alternative label that returns results
        }
      }
    }

    // Combine results in priority order: contributors -> subjects -> genres -> query
    const priorityOrder = ['contributors', 'subjects', 'genres', 'query'];

    for (const fetchType of priorityOrder) {
      if (imageSets[fetchType]) {
        imageSets[fetchType].forEach(image => {
          if (!allImages.some(existing => existing.id === image.id)) {
            allImages.push(image);
          }
        });
      }
    }

    // Sort to prefer portrait aspect ratios (aspectRatio < 1) while maintaining priority order
    if (options.preferPortrait) {
      allImages.sort((a, b) => {
        const aIsPortrait = (a.aspectRatio || 1) < 1;
        const bIsPortrait = (b.aspectRatio || 1) < 1;

        if (aIsPortrait && !bIsPortrait) return -1;
        if (!aIsPortrait && bIsPortrait) return 1;
        return 0; // Maintain original order for same aspect ratio type
      });
    }

    return allImages;
  } catch (error) {
    console.error('Failed to fetch concept images:', error);
    return [];
  }
};

const meta: Meta = {
  title: 'Components/ConceptCompositeImage',
  component: ConceptCompositeImage,
  args: {
    conceptId: 'patspgf3',
    includeContributors: true,
    includeSubjects: true,
    includeGenres: true,
    includeQuery: false,
    preferPortrait: true,
  },
  argTypes: {
    conceptId: {
      control: 'select',
      options: {
        Amulets: 'am28s7jx',
        'Photographic postcards': 't45bb9qg',
        'Mezzotint engraving': 'kayu55xf',
        Science: 'np8ek677',
        Technology: 'jr7tc6ky',
        Tuberculosis: 'kak297z4',
        Death: 'rxa2pk4j',
      },
      description: 'Concept to fetch images from',
    },
    includeContributors: {
      control: 'boolean',
      description: 'Include images where the concept is a contributor/creator',
    },
    includeSubjects: {
      control: 'boolean',
      description: 'Include images where the concept is a subject/topic',
    },
    includeGenres: {
      control: 'boolean',
      description: 'Include images where the concept defines the genre/format',
    },
    includeQuery: {
      control: 'boolean',
      description:
        'Include images from free-text search using the concept label',
    },
    preferPortrait: {
      control: 'boolean',
      description:
        'Whether to prioritize portrait aspect ratio images (height > width) in the selection',
    },
    images: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    gridSizes: {
      s: [12],
      m: [6],
      l: [4],
      xl: [4],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ConceptCompositeImage>;

const ConceptImageLoader = ({
  conceptId,
  includeContributors,
  includeSubjects,
  includeGenres,
  includeQuery,
  preferPortrait,
  args,
}: {
  conceptId: string;
  includeContributors: boolean;
  includeSubjects: boolean;
  includeGenres: boolean;
  includeQuery: boolean;
  preferPortrait: boolean;
  args: any;
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setImages([]);
    fetchConceptImages(conceptId, {
      includeContributors,
      includeSubjects,
      includeGenres,
      includeQuery,
      preferPortrait,
    }).then(fetchedImages => {
      setImages(fetchedImages);
      setLoading(false);
    });
  }, [
    conceptId,
    includeContributors,
    includeSubjects,
    includeGenres,
    includeQuery,
    preferPortrait,
  ]);

  if (loading) {
    return <div>Loading concept images...</div>;
  }

  if (images.length < 4) {
    return (
      <div>
        Not enough images found for concept {conceptId} (found {images.length})
      </div>
    );
  }

  // Take first 4 images
  const selectedImages = images.slice(0, 4) as [Image, Image, Image, Image];

  return <ConceptCompositeImage {...args} images={selectedImages} />;
};

export const Basic: Story = {
  name: 'ConceptCompositeImage',
  render: args => {
    return (
      <ConceptImageLoader
        key={`${args.conceptId}-${args.includeContributors}-${args.includeSubjects}-${args.includeGenres}-${args.includeQuery}-${args.preferPortrait}`}
        conceptId={args.conceptId}
        includeContributors={args.includeContributors}
        includeSubjects={args.includeSubjects}
        includeGenres={args.includeGenres}
        includeQuery={args.includeQuery}
        preferPortrait={args.preferPortrait}
        args={args}
      />
    );
  },
};
