import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import ConceptCard from '@weco/common/views/components/ConceptCard';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

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

// Fetch concept details to get label for title
const fetchConceptDetails = async (conceptId: string) => {
  try {
    const response = await fetch(
      `https://api.wellcomecollection.org/catalogue/v2/concepts/${conceptId}`
    );
    const data = await response.json();

    // Handle description which might be an object or string
    let description = 'Collection items related to this concept';
    if (data.description) {
      if (typeof data.description === 'string') {
        description = data.description;
      } else if (data.description.text) {
        description = data.description.text;
      }
    }

    return {
      label: data.label || 'Concept',
      description,
    };
  } catch (error) {
    console.error('Failed to fetch concept details:', error);
    return {
      label: 'Concept',
      description: 'Collection items related to this concept',
    };
  }
};

type StoryArgs = {
  conceptId: string;
  url: string;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/Cards/ConceptCard',
  args: {
    conceptId: 'am28s7jx',
    url: '#',
  },
  argTypes: {
    conceptId: {
      control: { type: 'select' },
      options: [
        's7d7wjf3',
        't45bb9qg',
        'kayu55xf',
        'np8ek677',
        'jr7tc6ky',
        'kak297z4',
        'rxa2pk4j',
      ],
      description: 'Concept to fetch images from',
    },
    url: {
      control: 'text',
      description: 'URL for the card link',
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

type Story = StoryObj<StoryArgs>;

const ConceptCardLoader = ({
  conceptId,
  url,
}: {
  conceptId: string;
  url: string;
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [conceptDetails, setConceptDetails] = useState({
    label: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setImages([]);
    Promise.all([
      fetchConceptImages(conceptId, {
        includeContributors: true,
        includeSubjects: true,
        includeGenres: true,
        includeQuery: false,
        preferPortrait: true,
      }),
      fetchConceptDetails(conceptId),
    ]).then(([fetchedImages, details]) => {
      setImages(fetchedImages);
      setConceptDetails(details);
      setLoading(false);
    });
  }, [conceptId]);

  if (loading) {
    return <div>Loading concept card...</div>;
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

  return (
    <ConceptCard
      images={selectedImages}
      title={conceptDetails.label}
      description={conceptDetails.description}
      url={url}
    />
  );
};

export const Basic: Story = {
  name: 'ConceptCard',
  render: args => {
    return (
      <ConceptCardLoader
        key={args.conceptId}
        conceptId={args.conceptId}
        url={args.url}
      />
    );
  },
};
