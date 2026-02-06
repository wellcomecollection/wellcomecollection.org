import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import ThemeCard from '@weco/common/views/components/ThemeCard';
import { useConceptImageUrls } from '@weco/content/hooks/useConceptImageUrls';
import { getConceptsByIds } from '@weco/content/services/wellcome/catalogue/concepts';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { toConceptLink } from '@weco/content/views/components/ConceptLink';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';

type ThemeCardsListProps = {
  title?: string;
  description?: string;
  conceptIds: string[];
};

const ListItem = styled.li`
  --gutter-size: ${props => props.theme.gutter.small};
  flex: 0 0 auto;
  width: 400px;
  max-width: 90vw;
  padding-left: var(--gutter-size);

  &:last-child {
    width: calc(400px + var(--gutter-size));
    max-width: calc(90vw + var(--gutter-size));
    padding-right: var(--gutter-size);
  }

  ${props => {
    const smGutter = props.theme.gutter.medium;
    const paddingCalc = `${props.theme.containerPaddingVw} * 2`;

    return props.theme.media('sm')(`
      --gutter-size: ${smGutter};
      /* 6 columns of 12 at sm breakpoint */
      /* Formula: ((100vw - padding) - (11 × gutter)) / 12 × 6 + (6 × gutter) */
      /* Simplified: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 6)) */
      width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 6));

      padding: 0 0 0 var(--gutter-size);

      &:nth-child(2) {
        padding-left: 0;
        width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 5));
      }
      &:last-child {
        padding-right: var(--gutter-size);
        width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 7));
      }
    `);
  }}

  ${props => {
    const mdGutter = props.theme.gutter.large;
    const lg = props.theme.sizes.lg;
    const paddingCalc = `${props.theme.containerPaddingVw} * 2`;

    return props.theme.media('md')(`
      --gutter-size: ${mdGutter};
      /* 4 columns of 12 at md breakpoint */
      /* Formula: ((100vw - padding) - (11 × gutter)) / 12 × 4 + (4 × gutter) */
      /* Simplified: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / 3 + (${mdGutter} * 4)) */
      width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / 3 + (${mdGutter} * 4));

      /* Max-width at lg: ((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 × 4 + (${mdGutter} * 4) */
      max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * 4 + (${mdGutter} * 4));

      &:nth-child(2){
        width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / 3 + (${mdGutter} * 3));
        max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * 4 + (${mdGutter} * 3));
      }

      &:last-child {
        padding-right: var(--gutter-size);
        width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / 3 + (${mdGutter} * 5));
        max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * 4 + (${mdGutter} * 5));
      }
    `);
  }}
`;

const Theme: FunctionComponent<{
  concept: Concept;
  // TODO
  // categoryLabel: string;
  // categoryPosition: number;
  positionInList: number;
}> = ({ concept, positionInList }) => {
  const images = useConceptImageUrls(concept);
  const linkProps = toConceptLink({ conceptId: concept.id });

  return linkProps && concept.displayLabel ? (
    <ThemeCard
      images={images}
      title={concept.displayLabel}
      description={concept.description?.text}
      linkProps={linkProps}
      dataGtmProps={{
        trigger: 'theme_promo_card',
        // 'category-label': categoryLabel,
        // 'category-position-in-list': String(categoryPosition),
        id: concept.id,
        'position-in-list': String(positionInList),
      }}
    />
  ) : null;
};

const ThemeCardsList: FunctionComponent<ThemeCardsListProps> = ({
  title,
  description,
  conceptIds,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (conceptIds.length > 0) {
        try {
          const result = await getConceptsByIds(conceptIds);
          setConcepts(result);
        } catch (error) {
          console.error('Failed to fetch concepts:', error);
        }
      }
    };

    fetchData();
  }, [conceptIds]);

  return (
    <div data-component="theme-cards-list">
      {title && (
        <ContaineredLayout gridSizes={gridSize12()}>
          {/* TODO which heading should this be? */}
          <h3 className={font('brand', 1)}>{title}</h3>
        </ContaineredLayout>
      )}

      {concepts.length > 0 && (
        <ScrollContainer
          gridSizes={gridSize12()}
          containerRef={scrollContainerRef}
          useShim={true}
          {...(description && {
            description: description,
          })}
        >
          {concepts.map((concept, index) => (
            <ListItem key={concept.id}>
              <Theme
                concept={concept}
                // categoryLabel={title}
                // categoryPosition={1}
                positionInList={index + 1}
              />
            </ListItem>
          ))}
        </ScrollContainer>
      )}
    </div>
  );
};

export default ThemeCardsList;
