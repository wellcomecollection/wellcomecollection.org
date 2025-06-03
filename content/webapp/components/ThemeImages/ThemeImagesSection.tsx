import { FunctionComponent, useRef } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import MoreLink from '../MoreLink';
import {
  capitalize,
  formatNumber,
  pluralize,
} from '@weco/common/utils/grammar';
import theme from '@weco/common/views/themes/default';
import { ReturnedResults } from '@weco/common/utils/search';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { Concept, Image } from '../../services/wellcome/catalogue/types';
import { toLink as toImagesLink } from '../SearchPagesLink/Images';
import { allRecordsLinkParams } from '../../utils/concepts';
import { ImagesLinkSource } from '@weco/common/data/segment-values';
import { usePathname } from 'next/navigation';
import { ThemeTabType } from '../ThemeWorks';
import ImageSectionGallery from './ImageSectionGallery';
import ImageScrollButtons from './ImageScrollButtons';

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

const ScrollButtonsContainer = styled(Space).attrs({
  as: 'h3',
  className: font('intsb', 2),
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  justify-content: space-between;
`;

const TotalCount = styled(Space).attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.400')};
`;

type Props = {
  singleSectionData: ReturnedResults<Image> | undefined;
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
  const scrollContainerRef = useRef<HTMLUListElement>(null);

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
      <Space $v={{ size: 's', properties: ['margin-top'] }}>
        <ScrollButtonsContainer>
          <TotalCount>{pluralize(totalResults, 'image')} from works</TotalCount>
          <ImageScrollButtons
            targetRef={scrollContainerRef}
          ></ImageScrollButtons>
        </ScrollButtonsContainer>
        <ImageSectionGallery
          images={singleSectionData.pageResults}
          scrollContainerRef={scrollContainerRef}
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
    </Space>
  );
};

export default ThemeImagesSection;
