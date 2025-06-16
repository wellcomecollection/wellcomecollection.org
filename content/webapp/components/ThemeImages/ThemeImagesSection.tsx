import { usePathname } from 'next/navigation';
import { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

import { ImagesLinkSource } from '@weco/common/data/segment-values';
import { font } from '@weco/common/utils/classnames';
import {
  capitalize,
  formatNumber,
  pluralize,
} from '@weco/common/utils/grammar';
import { ReturnedResults } from '@weco/common/utils/search';
import Space from '@weco/common/views/components/styled/Space';
import theme from '@weco/common/views/themes/default';
import CatalogueImageGallery from '@weco/content/components/CatalogueImageGallery';
import MoreLink from '@weco/content/components/MoreLink';
import { toLink as toImagesLink } from '@weco/content/components/SearchPagesLink/Images';
import { ThemeTabType } from '@weco/content/components/ThemeWorks';
import {
  Concept,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import { allRecordsLinkParams } from '@weco/content/utils/concepts';

const getLinkSource = (type, pathname: string) => {
  return `concept/images_${type}_${pathname}` as ImagesLinkSource;
};

const getAllImagesLink = (tabType, concept: Concept, pathname: string) => {
  const linkSource = getLinkSource(tabType, pathname);
  const sectionName = `images${capitalize(tabType)}`;
  return toImagesLink(allRecordsLinkParams(sectionName, concept), linkSource);
};

const getReadableType = (type: ThemeTabType) => {
  if (type === 'about') {
    return 'featuring';
  }

  return type;
};

const SectionHeading = styled(Space).attrs({
  as: 'h3',
  className: font('intsb', 2),
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  color: white;
`;

type Props = {
  singleSectionData?: ReturnedResults<Image>;
  totalResults: number;
  concept: Concept;
  type: ThemeTabType;
};

const ThemeImagesSection: FunctionComponent<Props> = ({
  singleSectionData,
  totalResults,
  concept,
  type,
}) => {
  const pathname = usePathname();
  const firstTenImages = useMemo(
    () => singleSectionData.pageResults.slice(0, 10),
    [singleSectionData]
  );

  if (!singleSectionData || singleSectionData.pageResults.length === 0) {
    return null;
  }

  const formattedTotalCount = formatNumber(totalResults, {
    isCompact: true,
  });

  return (
    <Space $v={{ size: 'l', properties: ['padding-top'] }}>
      <SectionHeading>
        Images {getReadableType(type)} {concept.label}
      </SectionHeading>
      <CatalogueImageGallery
        // Show the first 10 images, unless the total is 12 or fewer, in which case show all images
        images={
          totalResults > 12 ? firstTenImages : singleSectionData.pageResults
        }
        label={`${pluralize(totalResults, 'image')} from works`}
        variant="scrollable"
      />
      <Space $v={{ size: 'l', properties: ['margin-top'] }}>
        {singleSectionData.totalResults >
          singleSectionData.pageResults.length && (
          <MoreLink
            name={`All images ${getReadableType(type)} (${formattedTotalCount})`}
            url={getAllImagesLink(type, concept, pathname)}
            colors={theme.buttonColors.greenWhiteGreen}
          />
        )}
      </Space>
    </Space>
  );
};

export default ThemeImagesSection;
