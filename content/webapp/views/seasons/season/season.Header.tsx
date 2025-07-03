import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { getCrop } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import DateRange from '@weco/common/views/components/DateRange';
import LabelsList from '@weco/common/views/components/LabelsList';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyBottom } from '@weco/common/views/components/WobblyEdge';
import Standfirst from '@weco/common/views/slices/Standfirst';
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
  const { title, start, end, labels, untransformedStandfirst } = season;
  const superWidescreenImage = getCrop(season.image, '32:15');

  return (
    <ContaineredLayout gridSizes={gridSize12()}>
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
            <ContaineredLayout gridSizes={gridSize10()}>
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

                      {untransformedStandfirst && (
                        <Standfirst
                          slice={untransformedStandfirst}
                          index={0}
                          context={{}}
                          slices={[]}
                        />
                      )}
                    </Space>
                  </Space>
                </TextWrapper>
              </Space>
            </ContaineredLayout>
          </Space>
        </WobblyBottom>
      </HeaderWrapper>
    </ContaineredLayout>
  );
};

export default SeasonsHeader;
