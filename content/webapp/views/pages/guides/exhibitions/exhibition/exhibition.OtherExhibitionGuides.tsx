import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { ExhibitionGuideBasic } from '@weco/content/types/exhibition-guides';
import CardGrid from '@weco/content/views/components/CardGrid';

const PromoContainer = styled.div`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

type Props = {
  otherExhibitionGuides: ExhibitionGuideBasic[];
};

const OtherExhibitionGuides: FunctionComponent<Props> = ({
  otherExhibitionGuides,
}) => (
  <PromoContainer>
    <Space $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
      <ContaineredLayout gridSizes={gridSize8(false)}>
        <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
          <h2 className={font('brand', 1)}>
            Other exhibition guides available
          </h2>
        </Space>
      </ContaineredLayout>
      <CardGrid
        itemsHaveTransparentBackground={true}
        items={otherExhibitionGuides.map(result => ({
          ...result,
          type: 'exhibition-guides-links',
        }))}
        itemsPerRow={3}
      />
    </Space>
  </PromoContainer>
);

export default OtherExhibitionGuides;
