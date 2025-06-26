import { FunctionComponent } from 'react';

import { unavailableContentMessage } from '@weco/common/data/microcopy';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import BetaMessage from '@weco/content/components/BetaMessage';
import CataloguePageLayout from '@weco/content/components/CataloguePageLayout';
import useHotjar from '@weco/content/hooks/useHotjar'; // TODO remove all HotJars I've moved over
import {
  Image,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';

import IIIFViewer from './IIIFViewer';

export type Props = {
  image: Image;
  work: WorkBasic;
  iiifImageLocation?: DigitalLocation;
  iiifPresentationLocation?: DigitalLocation;
  apiToolbarLinks: ApiToolbarLink[];
};

const WorkImagesPage: FunctionComponent<Props> = ({
  image,
  work,
  iiifImageLocation,
  iiifPresentationLocation,
  apiToolbarLinks,
}) => {
  useHotjar(true);
  const title = work.title || '';

  return (
    <CataloguePageLayout
      title={title}
      description=""
      url={{
        pathname: `/works/${work.id}/images`,
        query: { id: image.id },
      }}
      openGraphType="website"
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="collections"
      apiToolbarLinks={apiToolbarLinks}
      hideNewsletterPromo={true}
      hideFooter={true}
      hideTopContent={true}
    >
      {iiifImageLocation ? (
        <IIIFViewer
          work={work}
          iiifImageLocation={iiifImageLocation}
          iiifPresentationLocation={iiifPresentationLocation}
          searchResults={null}
          setSearchResults={() => null}
        />
      ) : (
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <div style={{ marginTop: '98px' }}>
              <BetaMessage message={unavailableContentMessage} />
            </div>
          </Space>
        </ContaineredLayout>
      )}
    </CataloguePageLayout>
  );
};

export default WorkImagesPage;
