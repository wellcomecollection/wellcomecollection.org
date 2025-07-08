import Head from 'next/head';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { homepageHeading, pageDescriptions } from '@weco/common/data/microcopy';
import { ImageType } from '@weco/common/model/image';
import { StandfirstSlice as RawStandfirstSlice } from '@weco/common/prismicio-types';
import { font } from '@weco/common/utils/classnames';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import Standfirst from '@weco/common/views/slices/Standfirst';
import CardGrid from '@weco/content/views/components/CardGrid';
import ExhibitionsAndEvents from '@weco/content/views/components/ExhibitionsAndEvents';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import { ContentListProps, Slice } from '@weco/content/types/body';
import { convertItemToCardProps } from '@weco/content/types/card';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';

import SimpleCardGrid from './index.SimpleCardGrid';

const CreamBox = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

export type Props = {
  pageId: string;
  exhibitions: ExhibitionBasic[];
  nextSevenDaysEvents: EventBasic[];
  articles: Article[];
  jsonLd: JsonLdObj[];
  untransformedStandfirst?: RawStandfirstSlice;
  transformedHeaderList: Slice<'contentList', ContentListProps> | null;
  transformedContentList: Slice<'contentList', ContentListProps>;
};

const pageImage: ImageType = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/fc1e68b0528abbab8429d95afb5cfa4c74d40d52_tf_180516_2060224.jpg?auto=compress,format&w=800',
  width: 800,
  height: 450,
  alt: '',
};

const Homepage: FunctionComponent<Props> = ({
  nextSevenDaysEvents,
  exhibitions,
  articles,
  jsonLd,
  untransformedStandfirst,
  transformedHeaderList,
  transformedContentList,
  pageId,
}) => {
  return (
    <>
      <Head>
        {/*
          Verify our domain name for Meta/Facebook ads.

          This is necessary for brand safety.  Without domain verification, any advertiser
          could run ads that point to our website, and we wouldn't be able to control the
          copy or content of the ad.  Once the domain is verified, only approved partners
          can run ads that point to the Wellcome Collection website.

          Additionally, if we choose to use remarketing at any point, this verification
          will improve the accuracy of our tracking.

          Note: there are two other approaches for domain verification (uploading a file
          to our root domain, or creating a DNS TXT record), but I'm doing it this way
          because modifying HTML is something we do plenty of already, so we're more likely
          to get it right and/or notice if the mechanism has stopped working.

          See https://www.facebook.com/business/help/286768115176155?id=199156230960298
          See https://github.com/wellcomecollection/wellcomecollection.org/issues/9289
        */}
        <meta
          name="facebook-domain-verification"
          content="gl52uu0zshpy3yqv1ohxo3zq39mb0w"
        />
      </Head>
      <PageLayout
        title=""
        description={pageDescriptions.homepage}
        url={{ pathname: '/' }}
        jsonLd={jsonLd}
        openGraphType="website"
        image={pageImage}
        apiToolbarLinks={[createPrismicLink(pageId)]}
      >
        <ContaineredLayout gridSizes={gridSize10(false)}>
          <SpacingSection>
            <Space
              $v={{ size: 'l', properties: ['margin-top'] }}
              className={font('wb', 1)}
            >
              <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                <h1>{homepageHeading}</h1>
              </Space>
            </Space>

            {untransformedStandfirst && (
              <CreamBox>
                <Standfirst
                  slice={untransformedStandfirst}
                  index={0}
                  context={{}}
                  slices={[]}
                />{' '}
              </CreamBox>
            )}
          </SpacingSection>
        </ContaineredLayout>
        {transformedHeaderList && (
          <SpacingSection>
            {transformedHeaderList.value.title && (
              <SpacingComponent>
                <SectionHeader
                  title={transformedHeaderList.value.title}
                  gridSize={gridSize12()}
                />
              </SpacingComponent>
            )}
            <SpacingComponent>
              <SimpleCardGrid
                items={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  transformedHeaderList.value.items as any[]
                }
                isFeaturedFirst={true}
              />
            </SpacingComponent>
          </SpacingSection>
        )}

        {nextSevenDaysEvents.length + exhibitions.length > 0 && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader title="This week" gridSize={gridSize12()} />
            </SpacingComponent>
            <SpacingComponent>
              <ExhibitionsAndEvents
                exhibitions={exhibitions}
                events={nextSevenDaysEvents}
                links={[
                  {
                    text: 'All exhibitions and events',
                    url: `/${prismicPageIds.whatsOn}`,
                  },
                ]}
              />
            </SpacingComponent>
          </SpacingSection>
        )}

        {transformedContentList && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader
                title={transformedContentList.value.title || ''}
                gridSize={gridSize12()}
              />
            </SpacingComponent>
            <SpacingComponent>
              <SimpleCardGrid
                items={
                  transformedContentList.value.items.map(
                    item =>
                      item.type === 'seasons'
                        ? convertItemToCardProps(item)
                        : item
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ) as any[]
                }
              />
            </SpacingComponent>
          </SpacingSection>
        )}

        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title="Latest stories" gridSize={gridSize12()} />
          </SpacingComponent>
          <SpacingComponent>
            <CardGrid
              items={articles}
              itemsPerRow={4}
              itemsHaveTransparentBackground={true}
              links={[{ text: 'All stories', url: '/stories' }]}
            />
          </SpacingComponent>
        </SpacingSection>
      </PageLayout>
    </>
  );
};

export default Homepage;
