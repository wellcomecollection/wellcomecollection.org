import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Layout8 from '@weco/common/views/components/Layout10/Layout10';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import WobblyBottom from '@weco/common/views/components/WobblyBottom/WobblyBottom';
import { FunctionComponent, ComponentProps, ReactElement } from 'react';
import Space from '@weco/common/views/components/styled/Space';
import PageHeaderStandfirst from '../PageHeaderStandfirst/PageHeaderStandfirst';
import styled from 'styled-components';
import * as prismicT from '@prismicio/types';
import DateRange from '@weco/common/views/components/DateRange/DateRange';

const HeaderWrapper = styled.div`
  background: ${props => props.theme.color('neutral.700')};
  color: ${props => props.theme.color('white')};
`;
const TextWrapper = styled.div`
  border-left: 1px solid ${props => props.theme.color('accent.salmon')};
`;

const FeaturedMediaWrapper = styled.div`
  position: relative;
`;

const TitleWrapper = styled.h1.attrs({
  className: `${font('wb', 1)}`,
})`
  display: inline-block;
  margin-bottom: 0;
`;

type Props = {
  labels: ComponentProps<typeof LabelsList>;
  title: string;
  FeaturedMedia?: ReactElement<typeof PrismicImage>;
  standfirst?: prismicT.RichTextField;
  start?: Date;
  end?: Date;
};

const SeasonsHeader: FunctionComponent<Props> = ({
  labels,
  title,
  FeaturedMedia,
  standfirst,
  start,
  end,
}: Props) => {
  return (
    <Layout12>
      <HeaderWrapper>
        <WobblyBottom backgroundColor="white">
          {FeaturedMedia && (
            <FeaturedMediaWrapper>{FeaturedMedia}</FeaturedMediaWrapper>
          )}
          <Space
            v={{
              size: 'l',
              properties: ['padding-top', 'padding-bottom'],
            }}
          >
            <Layout8>
              <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                <TextWrapper>
                  <Space h={{ size: 'm', properties: ['padding-left'] }}>
                    {labels && labels.labels.length > 0 && (
                      <LabelsList
                        {...labels}
                        defaultLabelColor="accent.salmon"
                      />
                    )}
                    <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
                      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
                        <TitleWrapper>{title}</TitleWrapper>
                      </Space>
                      {start && end && (
                        <div className={font('intr', 5)}>
                          <DateRange start={start} end={end} />
                        </div>
                      )}
                      {standfirst && <PageHeaderStandfirst html={standfirst} />}
                    </Space>
                  </Space>
                </TextWrapper>
              </Space>
            </Layout8>
          </Space>
        </WobblyBottom>
      </HeaderWrapper>
    </Layout12>
  );
};

export default SeasonsHeader;