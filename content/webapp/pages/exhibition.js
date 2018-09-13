// @flow
import {Fragment} from 'react';
import {getExhibition} from '@weco/common/services/prismic/exhibitions';
import {isPast} from '@weco/common/utils/dates';
import PageWrapper, {pageStore} from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import {
  default as PageHeader,
  getFeaturedMedia,
  getHeroPicture
} from '@weco/common/views/components/PageHeader/PageHeader';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import Contributors from '@weco/common/views/components/Contributors/Contributors';
import Body from '@weco/common/views/components/Body/Body';
import InfoBox from '@weco/common/views/components/InfoBox/InfoBox';
import type {UiExhibition} from '@weco/common/model/exhibitions';
import {font} from '@weco/common/utils/classnames';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {getTodaysGalleriesHours} from '@weco/common/utils/get-todays-galleries-hours';

type Props = {|
  exhibition: UiExhibition
|}

export const ExhibitionPage = ({
  exhibition
}: Props) => {
  const breadcrumbs = {
    items: [{
      url: '/exhibitions',
      text: 'Exhibitions'
    }]
  };
  const labels = exhibition.isPermanent ? [{
    text: 'Permanent exhibition',
    url: ''
  }] : null;

  const genericFields = {
    id: exhibition.id,
    title: exhibition.title,
    contributors: exhibition.contributors,
    contributorsTitle: exhibition.contributorsTitle,
    promo: exhibition.promo,
    body: exhibition.body,
    promoImage: exhibition.promoImage,
    promoText: exhibition.promoText,
    image: exhibition.image,
    squareImage: exhibition.squareImage,
    widescreenImage: exhibition.widescreenImage
  };
  const DateInfo = exhibition.end ? <DateRange start={new Date(exhibition.start)} end={new Date(exhibition.end)} /> : <HTMLDate date={new Date(exhibition.start)} />;
  // This is for content that we don't have the crops for in Prismic
  const maybeHeroPicture = getHeroPicture(genericFields);
  const maybeFeaturedMedia = !maybeHeroPicture ? getFeaturedMedia(genericFields) : null;

  const Header = <PageHeader
    breadcrumbs={breadcrumbs}
    labels={labels ? ({labels}) : null}
    title={exhibition.title}
    Background={null}
    ContentTypeInfo={
      <Fragment>
        {DateInfo}
        <StatusIndicator start={exhibition.start} end={(exhibition.end || new Date())} />
      </Fragment>}
    FeaturedMedia={maybeFeaturedMedia}
    HeroPicture={maybeHeroPicture}
  />;

  // Info box content
  const openingTimes = pageStore('openingTimes');
  const galleriesLibraryVenues = openingTimes.groupedVenues && openingTimes.groupedVenues.galleriesLibrary.hours;
  const galleriesVenue = galleriesLibraryVenues && galleriesLibraryVenues.find(venue => venue.name === 'Galleries');
  const galleriesOpeningTimes = galleriesVenue && galleriesVenue.openingHours;

  const todaysGalleriesHours = getTodaysGalleriesHours(galleriesOpeningTimes);
  const todaysHoursText = `${todaysGalleriesHours.opens ? 'Open' : 'Closed'} today${todaysGalleriesHours.opens ? ' ' + todaysGalleriesHours.opens + '–' + todaysGalleriesHours.closes : ''}, Full opening times`;
  const admissionObject = {
    title: null,
    description: [{
      type: 'paragraph',
      text: 'Free admission',
      spans: []
    }],
    icon: 'ticket'
  };

  const todaysHoursObject = {
    title: null,
    description: [{
      type: 'paragraph',
      text: todaysHoursText,
      spans: [{
        type: 'hyperlink',
        start: todaysHoursText.length - 18,
        end: todaysHoursText.length,
        data: {
          url: '/opening-times'
        }
      }]
    }],
    icon: 'clock'
  };

  const placeObject = (exhibition.place && {
    title: null,
    description: [{
      type: 'paragraph',
      text: `${exhibition.place.title}, level ${exhibition.place.level}`,
      spans: []
    }],
    icon: 'location'
  });

  const resourcesItems = exhibition.resources.map(resource => {
    return {
      title: null,
      description: resource.description,
      icon: resource.icon
    };
  });

  const accessibilityItems = [
    {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'Step-free access is available to all floors of the building',
        spans: []
      }],
      icon: 'a11y'
    },
    {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'Large-print guides, transcripts and magnifiers are available in the gallery',
        spans: []
      }],
      icon: 'a11yVisual'
    }
  ];

  const infoItems = [
    admissionObject,
    todaysHoursObject,
    placeObject,
    ...resourcesItems,
    ...accessibilityItems
  ].filter(Boolean);

  return (
    <BasePage
      id={exhibition.id}
      Header={Header}
      Body={<Body body={exhibition.body} />}>

      <Fragment>
        {exhibition.contributors.length > 0 &&
          <Contributors
            titleOverride={exhibition.contributorsTitle}
            contributors={exhibition.contributors} />
        }
        {(exhibition.end && !isPast(exhibition.end)) &&
          <InfoBox title='Visit us' items={infoItems}>
            <p className={`plain-text no-margin ${font({s: 'HNL4'})}`}>
              <a href='/access'>Accessibility at Wellcome</a>
            </p>
          </InfoBox>
        }
      </Fragment>
    </BasePage>
  );
};

ExhibitionPage.getInitialProps = async ({req, query}) => {
  // TODO: We shouldn't need this, but do for flow as
  // `GetInitialPropsClientProps` doesn't have `req`
  if (req) {
    const {id} = query;
    const exhibition = await getExhibition(req, id);

    if (exhibition) {
      return {
        type: 'website',
        title: exhibition.title,
        imageUrl: exhibition.promoImage && convertImageUri(exhibition.promoImage.contentUrl, 800),
        description: exhibition.promoText,
        canonicalUrl: `https://wellcomecollection.org/exhibitions/${exhibition.id}`,
        pageJsonLd: exhibitionLd(exhibition),
        exhibition
      };
    } else {
      return {statusCode: 404};
    }
  }
};

export default PageWrapper(ExhibitionPage);
