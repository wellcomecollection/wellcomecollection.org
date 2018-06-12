import {Component} from 'react';
import {getCollectionOpeningTimes} from '@weco/common/services/prismic/opening-times';
import DefaultPageLayout from '@weco/common/views/components/DefaultPageLayout/DefaultPageLayout';

const isServer = typeof window === 'undefined';
// As this is a store, it's mutable
const clientStore = isServer ? null : {
  openingTimes: null,
  flags: null
};

async function fetchOpeningTimes() {
  const openingTimes = await getCollectionOpeningTimes();
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
    groupedVenues: groupedVenues,
    upcomingExceptionalOpeningPeriods: openingTimes.upcomingExceptionalOpeningPeriods
  };
}

const PageWrapper = Comp => {
  return class Global extends Component<Props> {
    static async getInitialProps(args) {
      const openingTimes = clientStore ? clientStore.openingTimes : await fetchOpeningTimes();

      return {
        openingTimes,
        ...(Comp.getInitialProps ? await Comp.getInitialProps(args) : null)
      };
    }

    constructor(props) {
      super(props);

      if (clientStore && !clientStore.appData) {
        clientStore.openingTimes = props.openingTimes;
      }
    }

    render() {
      const {
        title,
        description,
        type,
        url,
        imageUrl,
        siteSection,
        analyticsCategory,
        openingTimes,
        ...props
      } = this.props;
      console.info(clientStore && clientStore.openingTimes);
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
