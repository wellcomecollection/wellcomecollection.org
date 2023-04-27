import { LinkProps } from 'next/link';
import ImageEndpointSearchResults from '@weco/catalogue/components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import WorksSearchResults from '@weco/catalogue/components/WorksSearchResults/WorksSearchResults';
import {
  CatalogueResultsList,
  Image as ImageType,
  Work as WorkType,
} from '@weco/catalogue/services/wellcome/catalogue/types';
import Space from '@weco/common/views/components/styled/Space';

import { SeeMoreButton } from './SeeMoreButton';

type ImagesTabPanelType = {
  id: string;
  link: LinkProps;
  results: CatalogueResultsList<ImageType>;
};
export const ImagesTabPanel = ({ id, link, results }: ImagesTabPanelType) => {
  return (
    <div role="tabpanel" id={`tabpanel-${id}`} aria-labelledby={`tab-${id}`}>
      <ImageEndpointSearchResults images={results.results} />
      <Space v={{ size: 'm', properties: ['margin-top'] }}>
        <SeeMoreButton
          text="All images"
          totalResults={results.totalResults}
          link={link}
        />
      </Space>
    </div>
  );
};

type WorksTabPanelType = {
  id: string;
  link: LinkProps;
  results: CatalogueResultsList<WorkType>;
};
export const WorksTabPanel = ({ id, link, results }: WorksTabPanelType) => {
  return (
    <div className="container">
      <div role="tabpanel" id={`tabpanel-${id}`} aria-labelledby={`tab-${id}`}>
        <WorksSearchResults works={results.results} />
        <Space v={{ size: 'l', properties: ['padding-top'] }}>
          <SeeMoreButton
            text="All works"
            totalResults={results.totalResults}
            link={link}
          />
        </Space>
      </div>
    </div>
  );
};
