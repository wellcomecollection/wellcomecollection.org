import { FunctionComponent, useState, useEffect } from 'react';

import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import { BrowseTopic, randomTopicPool } from '@weco/content/data/browse/topics';
import { getConceptsByIds } from '@weco/content/services/wellcome/catalogue/browse';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';

import BrowseTopicCard from './topics.BrowseTopicCard';
import SurpriseMeCard from './topics.SurpriseMeCard';

type Props = {
  topics: BrowseTopic[];
};

const conceptIds = [
  "ta34s6m4",
  "hk965y34",
  "cwbamw59",
  "h9x3nny4",
  "uj4hz4ct",
  "u33bzxsb",
  "wmurzwwx",
  "wyjyu7gv"
];

const BrowseTopicsGrid: FunctionComponent<Props> = ({ topics }) => {
  const [surpriseTopic, setSurpriseTopic] = useState<{ label: string; id: string; } | null>(null);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [conceptImages, setConceptImages] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConceptsAndImages = async () => {
      try {
        setLoading(true);
        
        // Fetch concepts
        const fetchedConcepts = await getConceptsByIds(conceptIds);
        setConcepts(fetchedConcepts);

        // Fetch images for each concept
        const imagePromises = fetchedConcepts.map(async (concept) => {
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
              console.error(`Failed to fetch image for concept ${concept.id}:`, imagesResult);
              return { conceptId: concept.id, image: null };
            } else {
              const images = imagesResult.results || [];
              const firstImage = images.length > 0 ? images[0] : null;
              return { conceptId: concept.id, image: firstImage };
            }
          } catch (error) {
            console.error(`Error fetching image for concept ${concept.id}:`, error);
            return { conceptId: concept.id, image: null };
          }
        });

        // Wait for all image requests to complete
        const imageResults = await Promise.all(imagePromises);
        
        // Store images by concept ID
        const imagesMap: Record<string, any> = {};
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
  };  if (loading) {
    return <div>Loading topics...</div>;
  }

  return (
    <Grid>
      {concepts.map(topic => {
        const topicImage = conceptImages[topic.id];
        const topicWithImage = {
          ...topic,
          image: topicImage
        };
        
        return (
          <GridCell key={topic.id} $sizeMap={{ s: [12], m: [6], l: [4], xl: [4] }}>
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
