import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import ImageEndpointSearchResults from '../ImageEndpointSearchResults';
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

const getLinkSource = (type, pathname: string) => {
  return `concept/images_${type}_${pathname}` as ImagesLinkSource;
};

const getAllImagesLink = (tabType, concept: Concept, pathname: string) => {
  const linkSource = getLinkSource(tabType, pathname);
  const sectionName = `images${capitalize(tabType)}`;
  return toImagesLink(allRecordsLinkParams(sectionName, concept), linkSource);
};

const SectionHeading = styled(Space).attrs({
  as: 'h3',
  className: font('intsb', 2),
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  color: white;
`;

const TotalCount = styled.span.attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.400')};
`;

type Props = {
  singleSectionData: ReturnedResults<Image> | undefined;
  concept: Concept;
  type: ThemeTabType;
};

const ThemeImagesSection: FunctionComponent<Props> = ({
  singleSectionData,
  concept,
  type,
}) => {
  const pathname = usePathname();

  if (!singleSectionData || singleSectionData.pageResults.length === 0) {
    return null;
  }

  const formattedTotalCount = formatNumber(singleSectionData.totalResults, {
    isCompact: true,
  });

  return (
    <Space $v={{ size: 'l', properties: ['padding-top'] }}>
      <SectionHeading>Images {type}</SectionHeading>
      <TotalCount>
        {pluralize(singleSectionData.totalResults, 'image')} from works
      </TotalCount>
      <Space $v={{ size: 's', properties: ['margin-top'] }}>
        <ImageEndpointSearchResults images={singleSectionData.pageResults} />
        <Space $v={{ size: 'm', properties: ['margin-top'] }}>
          <MoreLink
            name={`All images ${type} (${formattedTotalCount})`}
            url={getAllImagesLink(type, concept, pathname)}
            colors={theme.buttonColors.greenWhiteGreen}
          />
        </Space>
      </Space>
    </Space>
  );
};

export default ThemeImagesSection;
