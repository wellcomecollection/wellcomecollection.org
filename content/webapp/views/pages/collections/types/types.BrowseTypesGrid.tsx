import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import ThemeCard from '@weco/common/views/components/ThemeCard';
import { BrowseType } from '@weco/content/data/browse/types';
import FeaturedCard from '@weco/content/views/components/FeaturedCard';

import BrowseTypeCard from './types.BrowseTypeCard';

type Props = {
  types: BrowseType[];
};

const BrowseTypesGrid: FunctionComponent<Props> = ({ types }) => {
  return (
    <Grid>
      {types.map(type => {
        const sizeMap: import('@weco/common/views/components/styled/Grid').SizeMap =
          type.size === 'large'
            ? { s: [12], m: [12], l: [12], xl: [12] }
            : type.size === 'medium'
              ? { s: [12], m: [6], l: [3], xl: [3] }
              : { s: [12], m: [6], l: [4], xl: [4] };

        return (
          <GridCell key={type.id} $sizeMap={sizeMap}>
            {type.size === 'large' ? (
              <FeaturedCard
                type="card"
                background={
                  type.id === 'books'
                    ? 'accent.salmon'
                    : type.id === '3d-objects'
                      ? 'accent.blue'
                      : 'warmNeutral.300'
                }
                textColor={type.id === '3d-objects' ? 'white' : 'black'}
                isReversed={type.id === 'archives'}
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
                <p className={font('intr', -1)}>{type.description}</p>
              </FeaturedCard>
            ) : type.size === 'medium' ? (
              type.imageUrls ? (
                <ThemeCard
                  images={[
                    type.imageUrls[0],
                    type.imageUrls[1],
                    type.imageUrls[2],
                    type.imageUrls[3],
                  ]}
                  title={type.label}
                  description={type.description}
                  linkProps={{
                    href: { pathname: `/collections/types/${type.slug}` },
                  }}
                />
              ) : (
                <ThemeCard
                  images={[]}
                  title={type.label}
                  description={type.description}
                  linkProps={{
                    href: { pathname: `/collections/types/${type.slug}` },
                  }}
                />
              )
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
