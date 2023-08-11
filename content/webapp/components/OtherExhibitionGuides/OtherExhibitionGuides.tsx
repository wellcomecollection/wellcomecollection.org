import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Space from '@weco/common/views/components/styled/Space';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import { ExhibitionGuideBasic } from '@weco/content/types/exhibition-guides';

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
    <Space v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
      <Layout8 shift={false}>
        <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
          <h2 className={font('wb', 3)}>Other exhibition guides available</h2>
        </Space>
      </Layout8>
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
