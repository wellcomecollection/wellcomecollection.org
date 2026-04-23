import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { DataGtmProps } from '@weco/common/utils/gtm';
import { gridSize12 } from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import LL from '@weco/common/views/components/styled/LL';
import ThemeCard from '@weco/common/views/components/ThemeCard';
import { useConceptImageUrls } from '@weco/content/hooks/useConceptImageUrls';
import { getConceptsByIds } from '@weco/content/services/wellcome/catalogue/concepts';
import {
  Concept,
  ConceptType,
} from '@weco/content/services/wellcome/catalogue/types';
import { toConceptLink } from '@weco/content/views/components/ConceptLink';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';

import { Description, ListItem, Title } from './ThemeCardsList.styles';

const Theme: FunctionComponent<{
  concept: Concept;
  gtmData: DataGtmProps;
  showDescriptionForTypes?: ConceptType[];
}> = ({ concept, gtmData, showDescriptionForTypes }) => {
  const images = useConceptImageUrls(concept);
  const linkProps = toConceptLink({ conceptId: concept.id });

  const description =
    showDescriptionForTypes === undefined ||
    showDescriptionForTypes.includes(concept.type)
      ? concept.description?.text
      : undefined;

  return linkProps && concept.displayLabel ? (
    <ThemeCard
      images={images}
      title={concept.displayLabel}
      description={description}
      linkProps={linkProps}
      dataGtmProps={{
        trigger: 'theme_promo_card',
        id: concept.id,
        ...gtmData,
      }}
    />
  ) : null;
};

type ThemeCardsListProps = {
  conceptIds: string[];
  description?: string;
  // If the following is to be undefined, it should be on purpose and not because of a forgotten prop.
  // This is why we don't make the individual properties optional
  gtmData: {
    ['category-label']: DataGtmProps['category-label'] | undefined;
    ['category-position-in-list']:
      | DataGtmProps['category-position-in-list']
      | undefined;
  };
  sliceTitle?: string;
  useShim?: boolean;
  gridSizes?: SizeMap;
  onConceptsFetched?: ({ count }: { count: number }) => void;
  showDescriptionForTypes?: ConceptType[];
  headingLevel?: 2 | 3;
  fontFamily?: 'brand-bold' | 'sans-bold';
  cols?: 3 | 4;
};

const ThemeCardsList: FunctionComponent<ThemeCardsListProps> = ({
  conceptIds,
  description,
  sliceTitle,
  useShim,
  gtmData,
  gridSizes = gridSize12(),
  onConceptsFetched,
  showDescriptionForTypes,
  headingLevel = 2,
  fontFamily = 'sans-bold',
  cols = 4,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (conceptIds.length > 0) {
        setIsLoading(true);
        try {
          const result = await getConceptsByIds(conceptIds);
          setConcepts(result);
          onConceptsFetched?.({ count: result.length });
        } catch (error) {
          console.error('Failed to fetch concepts:', error);
          setConcepts([]);
          onConceptsFetched?.({ count: 0 });
        } finally {
          setIsLoading(false);
        }
      } else {
        setConcepts([]);
        onConceptsFetched?.({ count: 0 });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [conceptIds]);

  // Reset scroll position when concept IDs change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [conceptIds]);

  if (!isLoading && concepts.length === 0) return null;

  return (
    <div data-component="theme-cards-list">
      <ScrollContainer
        gridSizes={gridSizes}
        containerRef={scrollContainerRef}
        useShim={useShim}
        CopyContent={
          sliceTitle || description ? (
            <>
              {sliceTitle && (
                <Title
                  $hasDescriptionSibling={!!description}
                  $headingLevel={headingLevel}
                  $fontFamily={fontFamily}
                >
                  {sliceTitle}
                </Title>
              )}

              {description && <Description>{description}</Description>}
            </>
          ) : undefined
        }
      >
        {isLoading ? (
          <div style={{ position: 'relative', height: '400px', width: '100%' }}>
            <LL />
          </div>
        ) : (
          <>
            {concepts.map((concept, i) => (
              <ListItem key={concept.id} $usesShim={useShim} $cols={cols}>
                <Theme
                  concept={concept}
                  gtmData={{ ...gtmData, 'position-in-list': `${i + 1}` }}
                  showDescriptionForTypes={showDescriptionForTypes}
                />
              </ListItem>
            ))}
          </>
        )}
      </ScrollContainer>
    </div>
  );
};

export default ThemeCardsList;
