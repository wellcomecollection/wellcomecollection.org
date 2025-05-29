import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import ImageEndpointSearchResults from '../ImageEndpointSearchResults';
import MoreLink from '../MoreLink';
import { formatNumber, pluralize } from "@weco/common/utils/grammar";
import theme from '@weco/common/views/themes/default';
import { ImageType } from '@weco/common/model/image';
import { ReturnedResults } from '@weco/common/utils/search';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';

const Heading = styled.h2.attrs({
  className: font('intsb', 2),
})`
  color: white;
`;

const TotalCount = styled.span.attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.400')};
`;

type Props = {
  singleSectionData: ReturnedResults<ImageType> | undefined;
  type: string;
};

const ThemeImagesSection: FunctionComponent<Props> = ({
  singleSectionData,
  type,
}) => {
  if (!singleSectionData || singleSectionData.pageResults.length === 0) {
    return;
  }

  const formattedTotalResults = formatNumber(singleSectionData.totalResults, {
    isCompact: true,
  });

  return (
    <>
      <Heading>Images {type}</Heading>
      <TotalCount>{pluralize(singleSectionData.totalResults, 'image')} from works</TotalCount>
      <Space $v={{ size: 'l', properties: ['margin-top'] }}>
        <ImageEndpointSearchResults images={singleSectionData.pageResults} />
        <Space $v={{ size: 'm', properties: ['margin-top'] }}>
          <MoreLink
            name={`All images ${type} (${formattedTotalResults})`}
            url={singleSectionData.requestUrl}
            colors={theme.buttonColors.greenWhiteGreen}
          />
        </Space>
      </Space>
    </>
  );
};

export default ThemeImagesSection;
