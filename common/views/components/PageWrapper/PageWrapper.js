// @flow
import {Component} from 'react';
import Error from 'next/error';
import {getCollectionOpeningTimes} from '../../../services/prismic/opening-times';
import DefaultPageLayout from '../DefaultPageLayout/DefaultPageLayout';
import type {OgType, SiteSection} from '../DefaultPageLayout/DefaultPageLayout';
import type {PlacesOpeningHours} from '../../../model/opening-hours';
import type {ComponentType} from 'react';

const isServer = typeof window === 'undefined';
// As this is a store, it's mutable
const clientStore = isServer ? null : new Map();
const serverStore = isServer ? new Map() : null;
const pageStoreHandler = {
  get: function(_, prop) {
    return isServer
      ? serverStore && serverStore.get(prop)
      : clientStore && clientStore.get(prop);
  },
  set: function() {
    throw Error('Page store: Please don\'t try to set props on me （/｡＼)');
  }
};
export const pageStore = new Proxy({
  flags: {
    apiV2: false
  }
}, pageStoreHandler);

async function fetchOpeningTimes(req: Request) {
  const openingTimes = await getCollectionOpeningTimes(req);
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

type Props = {|
  title: string,
  description: string,
  type: OgType,
  url: string,
  imageUrl: string,
  siteSection: SiteSection,
  analyticsCategory: string,
  openingTimes: {
    groupedVenues: {
      [string]: PlacesOpeningHours
    },
    upcomingExceptionalOpeningPeriods: {dates: Date[], type: string}[]
  },
  flags: { [string]: Boolean },
  statusCode: ?number
|}

// TODO: Make this universally available
type GetInitialPropsClientProps = {
  path: string,
  query: { [string]: any },
  jsonPageRes: Response, // Fetch Response
  asPath: string,
  err: Error,
  req: null,
  res: null
}

type GetInitialPropsServerProps = {|
  path: string,
  query: { [string]: any },
  asPath: string,
  req: Request,
  res: Response,
  err: Error,
  jsonPageRes: null
|}

type GetInitialPropsProps = GetInitialPropsServerProps | GetInitialPropsClientProps

type NextComponent = {
  getInitialProps?: (props: GetInitialPropsProps) => any
} & $Subtype<ComponentType<any>>

const PageWrapper = (Comp: NextComponent) => {
  return class Global extends Component<Props> {
    static async getInitialProps(context: GetInitialPropsProps) {
      // There's a lot of double checking here, which makes me think we've got
      // the typing wrong.
      const openingTimes = context.req
        ? await fetchOpeningTimes(context.req)
        : clientStore && clientStore.get('openingTimes');

      const flags = context.req
        ? context.query.flags
        : clientStore && clientStore.get('flags');

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

    constructor(props: Props) {
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

      if (this.props.statusCode && this.props.statusCode !== 200) {
        return <Error statusCode={this.props.statusCode} />;
      }

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
