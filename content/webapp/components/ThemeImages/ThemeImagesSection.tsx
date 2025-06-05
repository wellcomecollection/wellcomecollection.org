import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import MoreLink from '@weco/content/components/MoreLink';
import {
  capitalize,
  formatNumber,
  pluralize,
} from '@weco/common/utils/grammar';
import theme from '@weco/common/views/themes/default';
import { ReturnedResults } from '@weco/common/utils/search';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import {
  Concept,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import { toLink as toImagesLink } from '@weco/content/components/SearchPagesLink/Images';
import { allRecordsLinkParams } from '@weco/content/utils/concepts';
import { ImagesLinkSource } from '@weco/common/data/segment-values';
import { usePathname } from 'next/navigation';
import { ThemeTabType } from '@weco/content/components/ThemeWorks';
import ScrollableGallery from '@weco/content/components/ScrollableGallery/ScrollableGallery';

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
      <ScrollableGallery
        images={singleSectionData.pageResults}
        label={`${pluralize(totalResults, 'image')} from works`}
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
