// @flow
import {Component, Fragment} from 'react';
import {getCollectionOpeningTimes} from '@weco/common/services/prismic/opening-times';
import {getPage} from '@weco/common/services/prismic/pages';
import {classNames, font} from '@weco/common/utils/classnames';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Body from '@weco/common/views/components/Body/Body';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {contentLd} from '@weco/common/utils/json-ld';
import type {Page} from '@weco/common/model/pages';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  page: Page,
  openingHours: any // FIXME: Need the types from the opening-times service
|}

const cellStyles = {
  'vertical-align': 'top',
  border: '1px solid #000',
  padding: '5px',
  'min-width': '80px'
};

export class OpeningTimesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    // TODO: (Prismic perf) don't fetch these as two separate calls
    const [openingHours, page] = await Promise.all([
      getCollectionOpeningTimes(context.req),
      getPage(context.req, 'WwQHTSAAANBfDYXU')
    ]);
    const galleriesLibrary = openingHours && openingHours.placesOpeningHours && openingHours.placesOpeningHours.filter(venue => {
      return venue.name.toLowerCase() === 'galleries' || venue.name.toLowerCase() === 'library';
    });
    const restaurantCafeShop = openingHours && openingHours.placesOpeningHours && openingHours.placesOpeningHours.filter(venue => {
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
      title: page && page.title || '',
      description: page && page.promo && page.promo.caption || '',
      type: 'website',
      canonicalUrl: `https://wellcomecollection.org/opening-times`,
      imageUrl: page && page.promo && page.promo.image && convertImageUri(page.promo.image.contentUrl, 800),
      siteSection: 'visit-us',
      analyticsCategory: 'information',
      pageJsonLd: contentLd(page),
      openingHours: Object.assign({}, openingHours, {groupedVenues}),
      page
    };
  }
  render() {
    return (
      <ContentPage
        id={'openingTimes'}
        Header={
          <PageHeader
            breadcrumbs={{ items: [{url: '/', text: 'Home'}] }}
            labels={null}
            title={'Opening times'}
            ContentTypeInfo={
              <Fragment>
                <p>Explore our opening hours across the different parts of our building. keep in minde were open late on Thursdays!</p>
                <p>We&apos;ll have <a href='#revised'>revised opening hours over the festive holidays</a>. If you&apos;re planning to visit a long time in advance, check our <a href='#planned'>planned closure dates for all of 2019.</a></p>
              </Fragment>
            }
            Background={null}
            backgroundTexture={'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg'}
            FeaturedMedia={null}
            HeroPicture={null}
            highlightHeading={true} />
        }
        Body={<Body body={[]} />}
      >

        <Fragment>
          <h2 className={classNames({
            [font({s: 'WB6', m: 'WB5'})]: true
          })} id='regular'>Exhibitions, Library and Reading Room</h2>

          <h3>Regular opening times</h3>

          <table className='font-HNL5-s margin-bottom-s6' style={{'border-collapse': 'collapse'}}>
            <thead className='font-HNM5-s'>
              <tr>
                <th style={cellStyles} scope='col'>
                  <span className='visually-hidden'>Day</span>
                </th>
                <th style={cellStyles} scope='col'>Exhibitions</th>
                <th style={cellStyles} scope='col'>Library</th>
                <th style={cellStyles} scope='col'>Reading Room</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={cellStyles} scope='row'>Monday</th>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>Closed</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Tuesday</th>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Wednesday</th>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Thursday</th>
                <td style={cellStyles}>10:00—22:00</td>
                <td style={cellStyles}>10:00—20:00</td>
                <td style={cellStyles}>10:00—22:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Friday</th>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Saturday</th>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Sunday</th>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>11:00—18:00</td>
              </tr>
            </tbody>
          </table>

          <h3 id='revised'>Revised hours for the festive holiday</h3>

          <table className='font-HNL5-s margin-bottom-s6' style={{'border-collapse': 'collapse'}}>
            <thead className='font-HNM5-s'>
              <tr>
                <th style={cellStyles} scope='col'>
                  <span className='visually-hidden'>Day</span>
                </th>
                <th style={cellStyles} scope='col'>Exhibitions</th>
                <th style={cellStyles} scope='col'>Library</th>
                <th style={cellStyles} scope='col'>Reading Room</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={cellStyles} scope='row'>Mon 24 Dec—<br />Wed 26 Dec</th>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>Closed</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Thur 27 Dec—<br />Sat 29 Dec</th>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>10:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Mon 31 Dec—<br />Tue 1 Jan</th>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>Closed</td>
              </tr>
            </tbody>
          </table>

          <h2 className={classNames({
            [font({s: 'WB6', m: 'WB5'})]: true
          })}>Eat and shop</h2>

          <h3>Regular opening times</h3>

          <table className='font-HNL5-s margin-bottom-s6' style={{'border-collapse': 'collapse'}}>
            <thead className='font-HNM5-s'>
              <tr>
                <th style={cellStyles} scope='col'>
                  <span className='visually-hidden'>Day</span>
                </th>
                <th style={cellStyles} scope='col'>Café</th>
                <th style={cellStyles} scope='col'>Kitchen</th>
                <th style={cellStyles} scope='col'>Shop</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={cellStyles} scope='row'>Monday</th>
                <td style={cellStyles}>8:30—18:00</td>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>9:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Tuesday</th>
                <td style={cellStyles}>8:30—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>9:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Wednesday</th>
                <td style={cellStyles}>8:30—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>9:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Thursday</th>
                <td style={cellStyles}>8:30—22:00</td>
                <td style={cellStyles}>11:00—22:00</td>
                <td style={cellStyles}>9:00—22:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Friday</th>
                <td style={cellStyles}>8:30—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>9:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Saturday</th>
                <td style={cellStyles}>8:30—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Sunday</th>
                <td style={cellStyles}>10:30—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
              </tr>
            </tbody>
          </table>

          <h3>Revised hours for the festive holiday</h3>

          <table className='font-HNL5-s margin-bottom-s6' style={{'border-collapse': 'collapse'}}>
            <thead className='font-HNM5-s'>
              <tr>
                <th style={cellStyles} scope='col'>
                  <span className='visually-hidden'>Day</span>
                </th>
                <th style={cellStyles} scope='col'>Café</th>
                <th style={cellStyles} scope='col'>Kitchen</th>
                <th style={cellStyles} scope='col'>Shop</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={cellStyles} scope='row'>Mon 24 Dec—<br />Wed 26 Dec</th>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>Closed</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Thursday 27 Dec</th>
                <td style={cellStyles}>09:30—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>09:30—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Friday 28 Dec</th>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>09:30—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Saturday 29 Dec</th>
                <td style={cellStyles}>10:00—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>10:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Sunday 30 Dec</th>
                <td style={cellStyles}>10:30—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
                <td style={cellStyles}>11:00—18:00</td>
              </tr>
              <tr>
                <th style={cellStyles} scope='row'>Mon 31 Dec—<br />Tue 1 Jan</th>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>Closed</td>
                <td style={cellStyles}>Closed</td>
              </tr>
            </tbody>
          </table>

          <h2 className={classNames({
            [font({s: 'WB6', m: 'WB5'})]: true
          })} id='planned'>Planed closure dates and revised hours for 2019</h2>
          <h3 className='h3'>Easter / Spring holidays</h3>
          <ul>
            <li>Library will be closed 30 April—2 May</li>
            <li>Everything else will be open with revised hours</li>
          </ul>

          <h3 className='h3'>Bank holidays</h3>
          <ul>
            <li>Library will be closed 6-8 May, 26—28 May and 25—27 August</li>
            <li>Everything else will be open with revised hours</li>
          </ul>

          <h3 className='h3'>Christmas and New Year&apos;s festive holidays</h3>
          <ul>
            <li>Everything will be closed from 24—26 December and 31 Decemver—1 January</li>
            <li>Library will be closed from 24 December—1 January</li>
            <li>Everything else will be closed from 24—26 December and 31 December—1 January and have revised hours on 27-—0 December</li>
          </ul>
        </Fragment>
      </ContentPage>
    );
  }
}

export default PageWrapper(OpeningTimesPage);
