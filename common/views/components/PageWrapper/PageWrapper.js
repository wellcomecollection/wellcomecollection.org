import {Component} from 'react';
import {getCollectionOpeningTimes} from '@weco/common/services/prismic/opening-times';
import DefaultPageLayout from '@weco/common/views/components/DefaultPageLayout/DefaultPageLayout';

const isServer = typeof window === 'undefined';
// As this is a store, it's mutable
const clientStore = isServer ? null : {
  openingTimes: null
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
    static async getInitialProps(context) {
      const openingTimes = clientStore ? clientStore.openingTimes : await fetchOpeningTimes();
      const flags = clientStore ? clientStore.flags : context.query.flags;

      return {
        openingTimes,
        flags,
        ...(Comp.getInitialProps ? await Comp.getInitialProps(context) : null)
      };
    }

    constructor(props) {
      super(props);

      if (clientStore && !clientStore.appData) {
        clientStore.openingTimes = props.openingTimes;
      }

      if (clientStore && !clientStore.flags) {
        clientStore.flags = props.flags;
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
        flags,
        ...props
      } = this.props;

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
          <Comp {...props} flags={flags} />
        </DefaultPageLayout>
      );
    }
  };
};

export default PageWrapper;
