import { FunctionComponent } from 'react';

import { SiteSection } from '@weco/common/model/site-section';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import { makeLabels } from '@weco/common/views/components/LabelsList';
import { gridSize8 } from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { isEditorialImage } from '@weco/content/types/body';
import { Guide as GuideType } from '@weco/content/types/guides';
import Body from '@weco/content/views/components/Body';
import ContentPage from '@weco/content/views/components/ContentPage';
import { getFeaturedPictureWithTasl } from '@weco/content/views/components/ImageWithTasl';

export type Props = {
  guide: GuideType;
  jsonLd: JsonLdObj;
};

export const Guide: FunctionComponent<Props> = ({ guide, jsonLd }) => {
  const DateInfo = guide.datePublished && (
    <HTMLDateAndTime variant="date" date={guide.datePublished} />
  );

  const featuredPicture =
    guide.untransformedBody.length > 1 &&
    isEditorialImage(guide.untransformedBody[0])
      ? getFeaturedPictureWithTasl(guide.untransformedBody[0])
      : undefined;

  const hasFeaturedMedia = isNotUndefined(featuredPicture);

  const untransformedBody = hasFeaturedMedia
    ? guide.untransformedBody.slice(1)
    : guide.untransformedBody;

  const displayBackground = featuredPicture ? (
    <HeaderBackground backgroundTexture={headerBackgroundLs} />
  ) : undefined;

  const Header = (
    <PageHeader
      variant="basic"
      breadcrumbs={getBreadcrumbItems(guide.siteSection)}
      labels={makeLabels(guide.format?.title)}
      title={guide.title}
      FeaturedMedia={featuredPicture}
      Background={displayBackground}
      ContentTypeInfo={DateInfo}
      backgroundTexture={!featuredPicture ? headerBackgroundLs : undefined}
      highlightHeading={true}
      isContentTypeInfoBeforeMedia={false}
    />
  );

  return (
    <PageLayout
      title={guide.title}
      description={guide.metadataDescription || guide.promo?.caption || ''}
      url={{ pathname: `/guides/${guide.uid}` }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection={guide?.siteSection as SiteSection}
      image={guide.image}
      apiToolbarLinks={[createPrismicLink(guide.id)]}
    >
      <ContentPage
        id={guide.id}
        uid={guide.uid}
        Header={Header}
        Body={
          <Body
            untransformedBody={untransformedBody}
            pageId={guide.id}
            pageUid={guide.uid}
            onThisPage={guide.onThisPage}
            showOnThisPage={guide.showOnThisPage}
            gridSizes={gridSize8()}
          />
        }
      />
    </PageLayout>
  );
};

export default Guide;
