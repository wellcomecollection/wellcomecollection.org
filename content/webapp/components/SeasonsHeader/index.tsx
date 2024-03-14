import { FunctionComponent } from 'react';
import styled from 'styled-components';

// Helpers/Utils
import { font } from '@weco/common/utils/classnames';
import { getCrop } from '@weco/common/model/image';
import { components } from '@weco/common/views/slices';

// Components
import DateRange from '@weco/content/components/DateRange/DateRange';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import Layout, {
  gridSize12,
  gridSize10,
} from '@weco/common/views/components/Layout';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyBottom } from '@weco/common/views/components/WobblyEdge';
import { SliceZone } from '@prismicio/react';

// Types
import { Season } from '@weco/content/types/seasons';

const HeaderWrapper = styled.div`
  background: ${props => props.theme.color('neutral.700')};
  color: ${props => props.theme.color('white')};
`;
const TextWrapper = styled.div`
  border-left: 1px solid ${props => props.theme.color('accent.salmon')};
`;

type Props = {
  season: Season;
};

const SeasonsHeader: FunctionComponent<Props> = ({ season }) => {
  const { title, standfirst, start, end, labels, originalStandfirst } = season;

  const superWidescreenImage = getCrop(season.image, '32:15');

  return (
    <Layout gridSizes={gridSize12()}>
      <HeaderWrapper>
        <WobblyBottom backgroundColor="white">
          {superWidescreenImage && (
            <div style={{ position: 'relative' }}>
              <PrismicImage
                image={superWidescreenImage}
                sizes={{ xlarge: 1, large: 1, medium: 1, small: 1 }}
                quality="low"
              />
            </div>
          )}
          <Space
            $v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
          >
            <Layout gridSizes={gridSize10()}>
              <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                <TextWrapper>
                  <Space $h={{ size: 'm', properties: ['padding-left'] }}>
                    {labels.length > 0 && (
                      <LabelsList
                        labels={labels}
                        defaultLabelColor="accent.salmon"
                      />
                    )}
                    <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                      <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                        <h1
                          className={font('wb', 1)}
                          style={{ display: 'inline-block', marginBottom: 0 }}
                        >
                          {title}
                        </h1>
                      </Space>
                      {start && end && (
                        <div className={font('intr', 5)}>
                          <DateRange start={start} end={end} />
                        </div>
                      )}
                      {standfirst && <PageHeaderStandfirst html={standfirst} />}
                      {/* TODO need to toggle this or do we just leave it as it is? and remove the slice component? */}
                      {originalStandfirst && (
                        <SliceZone
                          slices={[originalStandfirst]}
                          components={components}
                          context={{}}
                        />
                      )}
                    </Space>
                  </Space>
                </TextWrapper>
              </Space>
            </Layout>
          </Space>
        </WobblyBottom>
      </HeaderWrapper>
    </Layout>
  );
};

export default SeasonsHeader;
