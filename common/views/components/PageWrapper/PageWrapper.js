import {Component} from 'react';
import {getCollectionOpeningTimes} from '@weco/common/services/prismic/opening-times';
import DefaultPageLayout from '@weco/common/views/components/DefaultPageLayout/DefaultPageLayout';
import lscache from 'lscache';

async function getCachedCollectionOpeningTimes() {
  let cachedResponse = lscache.get('opening-times');
  if (cachedResponse === null) {
    cachedResponse = await getCollectionOpeningTimes();
    lscache.set('opening-times', cachedResponse, 60 /* minutes */);
  }
  return cachedResponse;
}

const PageWrapper = Comp => {
  return class Global extends Component<Props> {
    static async getInitialProps(args) {
      const openingTimes = await getCachedCollectionOpeningTimes();
      const galleriesLibrary = openingTimes && openingTimes.placesOpeningHours.filter(venue => {
        return venue.name.toLowerCase() === 'galleries' || venue.name.toLowerCase() === 'library';
      });
      const restaurantCafeShop = openingTimes && openingTimes.placesOpeningHours.filter(venue => {
        return venue.name.toLowerCase() === 'restaurant' || venue.name.toLowerCase() === 'café' || venue.name.toLowerCase() === 'shop';
      });
      const groupedVenues = {
        galleriesLibrary: {
          title: 'Venue',
          hours: galleriesLibrary
        },
        restaurantCafeShop: {
          title: 'Eat & Shop',
          hours: restaurantCafeShop
        }
      };
      return {
        openingTimes: {
          groupedVenues: groupedVenues,
          upcomingExceptionalOpeningPeriods: openingTimes.upcomingExceptionalOpeningPeriods
        },
        ...(Comp.getInitialProps ? await Comp.getInitialProps(args) : null)
      };
    }
    render() {
      const {title, description, type, url, imageUrl, siteSection, analyticsCategory, openingTimes, ...props} = this.props;
      return (
        <DefaultPageLayout
          title={title}
          description={description}
          type={type}
          url={url}
          imageUrl={imageUrl}
          siteSection={siteSection}
          analyticsCategory={analyticsCategory}
          openingTimes={openingTimes}>
          <Comp {...props} />
        </DefaultPageLayout>
      );
    }
  };
};

export default PageWrapper;
