import {Component} from 'react';
import {getCollectionOpeningTimes} from '@weco/common/services/prismic/opening-times';
import DefaultPageLayout from '@weco/common/views/components/DefaultPageLayout/DefaultPageLayout';

const isServer = typeof window === 'undefined';
// As this is a store, it's mutable
const clientStore = isServer ? null : new Map();
const serverStore = isServer ? new Map() : null;
const pageStoreHandler = {
  get: function(_, prop) {
    return isServer ? serverStore.get(prop) : clientStore.get(prop);
  },
  set: function() {
    throw Error('Please don\'t try to set props on me （/｡＼)');
  }
};
export const pageStore = new Proxy({}, pageStoreHandler);

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
      const openingTimes = clientStore ? clientStore.get('openingTimes') : await fetchOpeningTimes();
      const flags = clientStore ? clientStore.get('flags') : context.query.flags;

      if (serverStore) {
        serverStore.set('openingTimes', openingTimes);
        serverStore.set('flags', flags);
      }

      return {
        openingTimes,
        flags,
        ...(Comp.getInitialProps ? await Comp.getInitialProps(context) : null)
      };
    }

    constructor(props) {
      super(props);

      if (clientStore && !clientStore.get('openingTimes')) {
        clientStore.set('openingTimes', props.openingTimes);
      }

      if (clientStore && !clientStore.get('flags')) {
        clientStore.set('flags', props.flags);
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
