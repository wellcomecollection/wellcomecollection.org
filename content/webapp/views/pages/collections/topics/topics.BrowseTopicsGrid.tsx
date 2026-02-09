import { FunctionComponent, useEffect, useState } from 'react';

import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import { BrowseTopic, randomTopicPool } from '@weco/content/data/browse/topics';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import { getConceptsByIds } from '@weco/content/services/wellcome/catalogue/concepts';
import {
  Concept,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';

import BrowseTopicCard from './topics.BrowseTopicCard';
import SurpriseMeCard from './topics.SurpriseMeCard';

const conceptIds = [
  'ta34s6m4',
  'hk965y34',
  'cwbamw59',
  'h9x3nny4',
  'uj4hz4ct',
  'u33bzxsb',
  'wmurzwwx',
  'wyjyu7gv',
];

type Props = {
  topics: BrowseTopic[];
};

const BrowseTopicsGrid: FunctionComponent<Props> = () => {
  const [surpriseTopic, setSurpriseTopic] = useState<{
    label: string;
    id: string;
  } | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [conceptImages, setConceptImages] = useState<
    Record<string, Image | null>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConceptsAndImages = async () => {
      try {
        setLoading(true);

        // Fetch concepts
        const fetchedConcepts = await getConceptsByIds(conceptIds);
        setConcepts(fetchedConcepts);

        // Fetch images for each concept
        const imagePromises = fetchedConcepts.map(async concept => {
          try {
            console.log(`Fetching image for concept: ${concept.label}`);
            const imagesResult = await catalogueQuery('images', {
              toggles: {},
              pageSize: 1, // Just need one image per concept
              params: {
                query: concept.label.toLowerCase(),
              },
            });

            if ('type' in imagesResult && imagesResult.type === 'Error') {
              console.error(
                `Failed to fetch image for concept ${concept.id}:`,
                imagesResult
              );
              return { conceptId: concept.id, image: null };
            } else {
              const images = imagesResult.results || [];
              const firstImage = images.length > 0 ? images[0] : null;
              // Type guard to ensure we have an Image type
              const imageResult =
                firstImage && firstImage.type === 'Image' ? firstImage : null;
              return { conceptId: concept.id, image: imageResult };
            }
          } catch (error) {
            console.error(
              `Error fetching image for concept ${concept.id}:`,
              error
            );
            return { conceptId: concept.id, image: null };
          }
        });

        // Wait for all image requests to complete
        const imageResults = await Promise.all(imagePromises);

        // Store images by concept ID
        const imagesMap: Record<string, Image | null> = {};
        imageResults.forEach(({ conceptId, image }) => {
          imagesMap[conceptId] = image;
        });

        setConceptImages(imagesMap);
      } catch (error) {
        console.error('Error fetching concepts and images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConceptsAndImages();
  }, []);

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * randomTopicPool.length);
    setSurpriseTopic(randomTopicPool[randomIndex]);
  };
  if (loading) {
    return <div>Loading topics...</div>;
  }

  return (
    <Grid>
      {concepts.map(topic => {
        const imageResult = conceptImages[topic.id];
        const topicWithImage = {
          ...topic,
          image: imageResult
            ? {
                locations: imageResult.locations,
                alternativeText: undefined,
              }
            : undefined,
        };

        return (
          <GridCell
            key={topic.id}
            $sizeMap={{ s: [12], m: [6], l: [4], xl: [4] }}
          >
            <BrowseTopicCard topic={topicWithImage} />
          </GridCell>
        );
      })}
      <GridCell $sizeMap={{ s: [12], m: [6], l: [4], xl: [4] }}>
        <SurpriseMeCard
          currentTopic={surpriseTopic}
          onSurpriseMe={handleSurpriseMe}
        />
      </GridCell>
    </Grid>
  );
};

export default BrowseTopicsGrid;
