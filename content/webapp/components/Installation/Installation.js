// @flow
import { useEffect, useState } from 'react';
import { exhibitionLd } from '@weco/common/utils/json-ld';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import DateAndStatusIndicator from '@weco/common/views/components/DateAndStatusIndicator/DateAndStatusIndicator';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
// $FlowFixMe(tsx)
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
// $FlowFixMe (tsx)
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
// $FlowFixMe (tsx)
import Body from '@weco/common/views/components/Body/Body';
import PageHeader, {
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import type { UiExhibition } from '@weco/common/model/exhibitions';
import { getInfoItems } from '../Exhibition/Exhibition';
import InfoBox from '@weco/common/views/components/InfoBox/InfoBox';
import { font } from '@weco/common/utils/classnames';
import { isPast } from '@weco/common/utils/dates';
import { getExhibitExhibition } from '@weco/common/services/prismic/exhibitions';

type Props = {|
  installation: UiExhibition,
|};

const Installation = ({ installation }: Props) => {
  const [partOf, setPartOf] = useState(null);
  useEffect(() => {
    getExhibitExhibition(null, installation.id).then(partOf => {
      if (partOf) {
        setPartOf(partOf);
      }
    });
  }, []);

  const FeaturedMedia = getFeaturedMedia({
    id: installation.id,
    title: installation.title,
    contributors: installation.contributors,
    contributorsTitle: installation.contributorsTitle,
    promo: installation.promo,
    body: installation.body,
    standfirst: installation.standfirst,
    promoImage: installation.promoImage,
    promoText: installation.promoText,
    image: installation.image,
    squareImage: installation.squareImage,
    widescreenImage: installation.widescreenImage,
    labels: installation.labels,
    metadataDescription: installation.metadataDescription,
  });

  const breadcrumbs = {
    items: [
      {
        text: 'Installations',
      },
      partOf && {
        url: `/exhibitions/${partOf.id}`,
        text: partOf.shortTitle || partOf.title,
        prefix: 'Part of',
      },
      {
        url: `/exhibitions/${installation.id}`,
        text: installation.title,
        isHidden: true,
      },
    ].filter(Boolean),
  };

  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: installation.labels }}
      title={installation.title}
      FeaturedMedia={FeaturedMedia}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      ContentTypeInfo={
        <>
          {installation.start && !installation.statusOverride && (
            <DateAndStatusIndicator
              start={installation.start}
              end={installation.end}
            />
          )}
          {installation.statusOverride && (
            <StatusIndicator
              start={installation.start}
              end={installation.end || new Date()}
              statusOverride={installation.statusOverride}
            />
          )}
        </>
      }
      HeroPicture={null}
      isContentTypeInfoBeforeMedia={true}
    />
  );
  return (
    <PageLayout
      title={installation.title}
      description={
        installation.metadataDescription || installation.promoText || ''
      }
      url={{ pathname: `/installations/${installation.id}` }}
      jsonLd={exhibitionLd(installation)}
      openGraphType={'website'}
      siteSection={'whats-on'}
      imageUrl={
        installation.image &&
        convertImageUri(installation.image.contentUrl, 800)
      }
      imageAltText={installation.image && installation.image.alt}
    >
      <ContentPage
        id={installation.id}
        Header={Header}
        Body={<Body body={installation.body} pageId={installation.id} />}
        contributorProps={{ contributors: installation.contributors }}
      >
        {installation.end && !isPast(installation.end) && (
          <InfoBox title="Visit us" items={getInfoItems(installation)}>
            <p className={`no-margin ${font('hnr', 5)}`}>
              <a href="/access">All our accessibility services</a>
            </p>
          </InfoBox>
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default Installation;
