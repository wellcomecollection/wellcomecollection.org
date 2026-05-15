import { NextPage } from 'next';

import { GalleryExhibitionData } from '@weco/common/server-data/types';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import { Container } from '@weco/common/views/components/styled/Container';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { ArticleBasic } from '@weco/content/types/articles';
import { Exhibition as ExhibitionType } from '@weco/content/types/exhibitions';
import StoryCard from '@weco/content/views/components/StoryCard';
import WorkCards from '@weco/content/views/components/WorkCards';

export type Props = {
  exhibition?: ExhibitionType;
  stories: ArticleBasic[];
  works: WorkBasic[];
  exhibitionData: GalleryExhibitionData | null;
  jsonLd?: JsonLdObj;
};

const ExhibitionExtrasPage: NextPage<Props> = ({
  exhibition,
  stories,
  works,
  exhibitionData,
  jsonLd,
}) => {
  const exhibitionTitle =
    exhibitionData?.title || exhibition?.title || 'Exhibition';

  return (
    <PageLayout
      title={`${exhibitionTitle} - Extras`}
      description={
        exhibition?.promo?.caption ||
        `Explore more works and stories related to ${exhibitionTitle}`
      }
      url={{ pathname: `/exhibitions/${exhibition?.id || 'extras'}/extras` }}
      jsonLd={jsonLd || { '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="whats-on"
      image={exhibition?.promo?.image}
    >
      <Container>
        <Space
          $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        >
          <h1>{exhibitionTitle} - Extras</h1>

          {works.length > 0 && (
            <Space
              $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
            >
              <h2>Related Works</h2>
              <WorkCards works={works} />
            </Space>
          )}

          {stories.length > 0 && (
            <Space
              $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
            >
              <h2>Related Stories</h2>
              <PlainList>
                {stories.map(story => (
                  <li key={story.id}>
                    <Space $v={{ size: 'lg', properties: ['margin-bottom'] }}>
                      <StoryCard variant="prismic" article={story} />
                    </Space>
                  </li>
                ))}
              </PlainList>
            </Space>
          )}

          {stories.length === 0 && works.length === 0 && (
            <p>No extras available for this exhibition.</p>
          )}
        </Space>
      </Container>
    </PageLayout>
  );
};

export default ExhibitionExtrasPage;
