import type { GetServerSideProps } from 'next';
import { FC } from 'react';
import { getPlace } from '@weco/common/services/prismic/places';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import Body from '@weco/common/views/components/Body/Body';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import type { Place } from '@weco/common/model/places';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { getServerData } from '@weco/common/server-data';

type Props = {
  place: Place;
} & WithGlobalContextData;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const globalContextData = getGlobalContextData(context);
    const { id, memoizedPrismic } = context.query;
    const place = await getPlace(context.req, id, memoizedPrismic);

    if (place) {
      return {
        props: removeUndefinedProps({
          place,
          globalContextData,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const PlacePage: FC<Props> = ({ place, globalContextData }) => {
  const breadcrumbs = {
    items: [
      {
        text: 'Places',
      },
      {
        url: `/places/${place.id}`,
        text: place.title,
        isHidden: true,
      },
    ],
  };
  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={null}
      title={place.title}
      FeaturedMedia={null}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      ContentTypeInfo={null}
      HeroPicture={null}
    />
  );

  return (
    <PageLayout
      title={place.title}
      description={place.metadataDescription || place.promoText || ''}
      url={{ pathname: `/places/${place.id}` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={'visit-us'}
      imageUrl={place.image && convertImageUri(place.image.contentUrl, 800)}
      imageAltText={(place.image && place.image.alt) ?? undefined}
      globalContextData={globalContextData}
    >
      <ContentPage
        id={place.id}
        Header={Header}
        Body={<Body body={place.body} pageId={place.id} />}
      />
    </PageLayout>
  );
};

export default PlacePage;
