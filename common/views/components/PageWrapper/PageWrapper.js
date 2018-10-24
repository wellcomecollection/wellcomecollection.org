// @flow
import {Component} from 'react';
import {getCollectionOpeningTimes} from '../../../services/prismic/opening-times';
import DefaultPageLayout from '../DefaultPageLayout/DefaultPageLayout';
import ErrorPage from '../BasePage/ErrorPage';
import {fetchGlobalAlert} from '../../../services/prismic/global-alert';
import type Moment from 'moment';
import type {ComponentType} from 'react';
import type {OgType, SiteSection, JsonLdObject} from '../DefaultPageLayout/DefaultPageLayout';
import type {GroupedVenues, OverrideType} from '../../../model/opening-hours';

const isServer = typeof window === 'undefined';
// As this is a store, it's mutable
const clientStore = isServer ? null : new Map();
const serverStore = isServer ? new Map() : null;

// Don't use this as an import, it only get's set once `getIntialProps` has run,
// So Should rather be used in the components getInitialProps, where we pass it
// to. Left for legacy reasons.
export function pageStore(prop: string) {
  const val = isServer
    ? serverStore && serverStore.get(prop)
    : clientStore && clientStore.get(prop);

  return val || {};
}

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
    collectionOpeningTimes: openingTimes,
    groupedVenues: groupedVenues,
    upcomingExceptionalOpeningPeriods: openingTimes.upcomingExceptionalOpeningPeriods
  };
}

type Props = {|
  title: string,
  description: string,
  type: OgType,
  canonicalUrl: string,
  imageUrl: string,
  pageJsonLd: JsonLdObject,
  siteSection: SiteSection,
  analyticsCategory: string,
  openingTimes: {
    // TODO: Flow fix
    collectionOpeningTimes: any,
    groupedVenues: GroupedVenues,
    upcomingExceptionalOpeningPeriods: {dates: Moment[], type: OverrideType}[]
  },
  toggles: any,
  globalAlert: any, // TODO
  statusCode: ?number,
  oEmbedUrl?: string,
  pageState: ?Object
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
  jsonPageRes: null,
  asPath: string,
  req: Request,
  res: Response,
  err: Error
|}

export type GetInitialPropsProps =
  | GetInitialPropsServerProps
  | GetInitialPropsClientProps;

// TODO: (Type)
export type ExtraProps = {
  toggles?: any
};

type NextComponent = {
  getInitialProps?: (props: GetInitialPropsProps, extraProps: ExtraProps) => any,
} & $Subtype<ComponentType<any>>

const PageWrapper = (Comp: NextComponent) => {
  return class Global extends Component<Props> {
    static async getInitialProps(context: GetInitialPropsProps) {
      // There's a lot of double checking here, which makes me think we've got
      // the typing wrong.
      const openingTimes = context.req
        ? await fetchOpeningTimes(context.req)
        : clientStore && clientStore.get('openingTimes');

      const toggles = context.req
        ? context.query.toggles
        : clientStore && clientStore.get('toggles');

      const globalAlert = context.req
        ? await fetchGlobalAlert()
        : clientStore && clientStore.get('globalAlert');

      if (serverStore) {
        serverStore.set('openingTimes', openingTimes);
        serverStore.set('toggles', toggles);
        serverStore.set('globalAlert', globalAlert);
      }

      const initialProps = Comp.getInitialProps
        ? await Comp.getInitialProps(context, { toggles }) : {};

      return {
        openingTimes,
        toggles,
        globalAlert,
        ...initialProps
      };
    }

    constructor(props: Props) {
      super(props);

      if (clientStore && !clientStore.get('openingTimes')) {
        clientStore.set('openingTimes', props.openingTimes);
      }

      if (clientStore && !clientStore.get('toggles')) {
        clientStore.set('toggles', props.toggles);
      }

      if (clientStore && !clientStore.get('globalAlert')) {
        clientStore.set('globalAlert', props.globalAlert);
      }
    }

    render() {
      const {
        title,
        description,
        type,
        canonicalUrl,
        imageUrl,
        pageJsonLd,
        siteSection,
        analyticsCategory,
        openingTimes,
        globalAlert,
        oEmbedUrl,
        pageState,
        ...props
      } = this.props;

      if (this.props.statusCode && this.props.statusCode !== 200) {
        return <DefaultPageLayout
          title={`${this.props.statusCode}`}
          description='Nothing to see here, literally, nothing'
          type='website'
          canonicalUrl='https://wellcomecollection.org'
          imageUrl='https://iiif.wellcomecollection.org/image/V0021348.jpg/full/760,/0/default.jpg'
          pageJsonLd={{'@type': 'WebPage'}}
          siteSection='error'
          analyticsCategory='error'
          openingTimes={openingTimes}
          globalAlert={globalAlert}
          pageState={null}>
          <ErrorPage errorStatus={this.props.statusCode} />
        </DefaultPageLayout>;
      }

      return (
        <DefaultPageLayout
          title={title}
          description={description}
          type={type}
          canonicalUrl={canonicalUrl}
          imageUrl={imageUrl}
          pageJsonLd={pageJsonLd}
          siteSection={siteSection}
          analyticsCategory={analyticsCategory}
          openingTimes={openingTimes}
          globalAlert={globalAlert}
          oEmbedUrl={oEmbedUrl}
          pageState={pageState}>
          <Comp {...props} />
        </DefaultPageLayout>
      );
    }
  };
};

export default PageWrapper;
