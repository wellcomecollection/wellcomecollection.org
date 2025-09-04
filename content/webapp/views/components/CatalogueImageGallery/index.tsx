import { FunctionComponent } from 'react';

import CatalogueImageGalleryJustified, {
  Props as CatalogueImageGalleryJustifiedProps,
} from '@weco/content/views/components/CatalogueImageGallery/CatalogueImageGallery.Justified';
import CatalogueImageGalleryScrollable, {
  Props as CatalogueImageGalleryScrollableProps,
} from '@weco/content/views/components/CatalogueImageGallery/CatalogueImageGallery.Scrollable';

type Props =
  | (CatalogueImageGalleryJustifiedProps & { variant: 'justified' })
  | (CatalogueImageGalleryScrollableProps & {
      variant: 'scrollable';
      scrollButtonsAfter?: boolean;
    });

const CatalogueImageGallery: FunctionComponent<Props> = props => {
  const { variant } = props;

  return (
    <>
      {variant === 'justified' ? (
        <CatalogueImageGalleryJustified
          data-component="catalogue-image-gallery-justified"
          {...props}
        />
      ) : (
        <CatalogueImageGalleryScrollable
          data-component="catalogue-image-gallery-scrollable"
          {...props}
        />
      )}
    </>
  );
};

export default CatalogueImageGallery;
