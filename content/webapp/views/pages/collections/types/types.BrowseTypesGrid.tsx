import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import { BrowseType } from '@weco/content/data/browse/types';
import FeaturedCard from '@weco/content/views/components/FeaturedCard';
import ImagePlaceholder from '@weco/content/views/components/ImagePlaceholder';

import BrowseTypeCard from './types.BrowseTypeCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacingUnit * 3}px;

  ${props => props.theme.media('medium')`
    gap: ${props.theme.spacingUnit * 4}px;
  `}
`;

type Props = {
  types: BrowseType[];
};

const BrowseTypesGrid: FunctionComponent<Props> = ({ types }) => {
  return (
    <Grid>
      {types.map(type => {
        const sizeMap =
          type.size === 'large'
            ? { s: [12], m: [12], l: [12], xl: [12] }
            : type.size === 'medium'
              ? { s: [12], m: [6], l: [6], xl: [6] }
              : { s: [12], m: [6], l: [4], xl: [4] };

        return (
          <GridCell key={type.id} $sizeMap={sizeMap}>
            {type.size === 'large' ? (
              <FeaturedCard
                type="card"
                background="warmNeutral.300"
                textColor="black"
                image={
                  type.imageUrl
                    ? {
                        contentUrl: type.imageUrl,
                        width: 800,
                        height: 450,
                        alt: '',
                      }
                    : undefined
                }
                labels={[{ text: `${type.workCount.toLocaleString()} items` }]}
                link={{
                  url: `/collections/types/${type.slug}`,
                  text: type.label,
                }}
              >
                <h2 className={font('wb', 2)}>{type.label}</h2>
                <p className={font('intr', 5)}>{type.description}</p>
              </FeaturedCard>
            ) : (
              <BrowseTypeCard type={type} />
            )}
          </GridCell>
        );
      })}
    </Grid>
  );
};

export default BrowseTypesGrid;
