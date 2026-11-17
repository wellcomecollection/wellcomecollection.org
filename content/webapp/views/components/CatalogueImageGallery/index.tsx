import { FunctionComponent } from 'react';

import CatalogueImageGalleryJustified, {
  Props as CatalogueImageGalleryJustifiedProps,
} from '@weco/content/views/components/CatalogueImageGallery/CatalogueImageGallery.Justified';
import CatalogueImageGalleryMasonry, {
  Props as CatalogueImageGalleryMasonryProps,
} from '@weco/content/views/components/CatalogueImageGallery/CatalogueImageGallery.Masonry';
import CatalogueImageGalleryScrollable, {
  Props as CatalogueImageGalleryScrollableProps,
} from '@weco/content/views/components/CatalogueImageGallery/CatalogueImageGallery.Scrollable';

type Props =
  | (CatalogueImageGalleryJustifiedProps & { variant: 'justified' })
  | (CatalogueImageGalleryMasonryProps & { variant: 'masonry' })
  | (CatalogueImageGalleryScrollableProps & {
      variant: 'scrollable';
      scrollButtonsAfter?: boolean;
    });

const CatalogueImageGallery: FunctionComponent<Props> = props => {
  switch (props.variant) {
    case 'justified':
      return (
        <CatalogueImageGalleryJustified
          data-component="catalogue-image-gallery-justified"
          {...props}
        />
      );
    case 'masonry':
      return (
        <CatalogueImageGalleryMasonry
          data-component="catalogue-image-gallery-masonry"
          {...props}
        />
      );
    case 'scrollable':
      return (
        <CatalogueImageGalleryScrollable
          data-component="catalogue-image-gallery-scrollable"
          {...props}
        />
      );
  }
};

export default CatalogueImageGallery;
