import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import { Image } from '@weco/content/services/wellcome/catalogue/types';

import ConceptCompositeImage from './ConceptCompositeImage';

// Fetch images for a concept from production API
const fetchConceptImages = async (
  conceptId: string,
  useQueryOnly: boolean = false,
  preferPortrait: boolean = true
): Promise<Image[]> => {
  try {
    // First, fetch the concept details to get its label for genre search
    const conceptResponse = await fetch(
      `https://api.wellcomecollection.org/catalogue/v2/concepts/${conceptId}`
    );
    const conceptData = await conceptResponse.json();
    const conceptLabel = conceptData.label || '';

    let allImages: Image[] = [];

    if (useQueryOnly && conceptLabel) {
      // Query-only mode: use free-text search
      const queryResponse = await fetch(
        `https://api.wellcomecollection.org/catalogue/v2/images?query=${encodeURIComponent(
          conceptLabel
        )}`
      );
      const queryData = await queryResponse.json();
      allImages = queryData.results || [];
    } else {
      // Relationship-based mode: use specific API endpoints
      const [imagesByResponse, imagesFeaturedResponse, imagesGenreResponse] =
        await Promise.all([
          fetch(
            `https://api.wellcomecollection.org/catalogue/v2/images?source.contributors.agent=${conceptId}`
          ),
          fetch(
            `https://api.wellcomecollection.org/catalogue/v2/images?source.subjects=${conceptId}`
          ),
          fetch(
            `https://api.wellcomecollection.org/catalogue/v2/images?source.genres.label=${encodeURIComponent(
              conceptLabel
            )}`
          ),
        ]);

      const imagesByData = await imagesByResponse.json();
      const imagesFeaturedData = await imagesFeaturedResponse.json();
      const imagesGenreData = await imagesGenreResponse.json();

      const imagesBy = imagesByData.results || [];
      const imagesFeatured = imagesFeaturedData.results || [];
      let imagesGenre = imagesGenreData.results || [];

      // If no genre results with main label, try alternative labels
      if (imagesGenre.length === 0 && conceptData.alternativeLabels) {
        for (const altLabel of conceptData.alternativeLabels) {
          const altGenreResponse = await fetch(
            `https://api.wellcomecollection.org/catalogue/v2/images?source.genres.label=${encodeURIComponent(
              altLabel
            )}`
          );
          const altGenreData = await altGenreResponse.json();
          const altGenreResults = altGenreData.results || [];
          if (altGenreResults.length > 0) {
            imagesGenre = altGenreResults;
            break; // Use first alternative label that returns results
          }
        }
      }

      // Combine all arrays, removing duplicates by id
      // Prioritize images by the concept first, then featured, then genre
      allImages = [...imagesBy];
      imagesFeatured.forEach(image => {
        if (!allImages.some(existing => existing.id === image.id)) {
          allImages.push(image);
        }
      });
      imagesGenre.forEach(image => {
        if (!allImages.some(existing => existing.id === image.id)) {
          allImages.push(image);
        }
      });
    }

    // Sort to prefer portrait aspect ratios (aspectRatio < 1) while maintaining priority order
    if (preferPortrait) {
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
    useQueryOnly: false,
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
    useQueryOnly: {
      control: 'boolean',
      description:
        'Search mode: Query-only (free-text search) or Relationship-based (genre + contributors + subjects)',
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
  useQueryOnly,
  preferPortrait,
  args,
}: {
  conceptId: string;
  useQueryOnly: boolean;
  preferPortrait: boolean;
  args: any;
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setImages([]);
    fetchConceptImages(conceptId, useQueryOnly, preferPortrait).then(
      fetchedImages => {
        setImages(fetchedImages);
        setLoading(false);
      }
    );
  }, [conceptId, useQueryOnly, preferPortrait]);

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
        key={`${args.conceptId}-${args.useQueryOnly}-${args.preferPortrait}`}
        conceptId={args.conceptId}
        useQueryOnly={args.useQueryOnly}
        preferPortrait={args.preferPortrait}
        args={args}
      />
    );
  },
};
