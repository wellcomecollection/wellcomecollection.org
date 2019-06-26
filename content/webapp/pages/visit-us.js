// @flow
import type { Context } from 'next';
import { Component } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
// import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
// import Body from '@weco/common/views/components/Body/Body';
// import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
// import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
// import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
// import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
// import { UiImage } from '@weco/common/views/components/Images/Images';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { getPage } from '@weco/common/services/prismic/pages';
import { contentLd } from '@weco/common/utils/json-ld';
import { classNames, spacing, font, grid } from '@weco/common/utils/classnames';
import type { Page as PageType } from '@weco/common/model/pages';
// import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import FindUs from '@weco/common/views/components/FindUs/FindUs';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
import Icon from '@weco/common/views/components/Icon/Icon';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { defaultSerializer } from '@weco/common/services/prismic/html-serialisers';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
import { getTodaysVenueHours } from '@weco/common/services/prismic/opening-times';
import {
  planList,
  findList,
  eatShopList,
  lastPara,
} from '@weco/content/content/visit-us-content';

type ContainerProps = {|
  children: any,
|};

const Container = ({ children }: ContainerProps) => (
  <SpacingComponent>
    <div
      className={classNames({
        'body-part': true,
      })}
    >
      <Layout8>{children}</Layout8>
    </div>
  </SpacingComponent>
);

type Props = {|
  page: PageType,
|};

// const backgroundTexture =
//   'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';

export class Page extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { id } = ctx.query;
    const page = await getPage(ctx.req, id);

    if (page) {
      return {
        page,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { page } = this.props;
    // const DateInfo = page.datePublished && (
    //   <HTMLDate date={new Date(page.datePublished)} />
    // );

    // const hasFeaturedMedia =
    //   page.body.length > 1 &&
    //   (page.body[0].type === 'picture' || page.body[0].type === 'videoEmbed');
    // const body = hasFeaturedMedia
    //   ? page.body.slice(1, page.body.length)
    //   : page.body;
    // const FeaturedMedia = null;
    // const FeaturedMedia = hasFeaturedMedia ? (
    //   page.body[0].type === 'picture' ? (
    //     <UiImage
    //       {...page.body[0].value.image.crops['16:9'] ||
    //         page.body[0].value.image}
    //     />
    //   ) : page.body[0].type === 'videoEmbed' ? (
    //     <VideoEmbed {...page.body[0].value} />
    //   ) : null
    // ) : null;

    // TODO: This is not the way to do site sections
    // const breadcrumbs = {
    //   items: page.siteSection
    //     ? [
    //         {
    //           text: 'Visit us',
    //           url: '',
    //         },
    //       ]
    //     : [],
    // };
    // const Header = (
    //   <PageHeader
    //     breadcrumbs={breadcrumbs}
    //     labels={null}
    //     title={page.title}
    //     FeaturedMedia={FeaturedMedia}
    //     Background={
    //       FeaturedMedia && (
    //         <HeaderBackground backgroundTexture={backgroundTexture} />
    //       )
    //     }
    //     ContentTypeInfo={DateInfo}
    //     HeroPicture={null}
    //     backgroundTexture={!FeaturedMedia ? backgroundTexture : null}
    //     highlightHeading={true}
    //   />
    // );

    // https://iiif.wellcomecollection.org/image/prismic:cf3a67bd2a4aee34132f83c1f3d50636b01d1c42_ep_000629_003.jpg/full/2048,/0/default.jpg
    return (
      <PageLayout
        title={page.title}
        description={page.metadataDescription || page.promoText || ''}
        url={{ pathname: `/pages/${page.id}` }}
        jsonLd={contentLd(page)}
        openGraphType={'website'}
        siteSection={
          page.siteSection === 'what-we-do' || page.siteSection === 'visit-us'
            ? page.siteSection
            : null
        }
        imageUrl={page.image && convertImageUri(page.image.contentUrl, 800)}
        imageAltText={page.image && page.image.alt}
      >
        <OpeningTimesContext.Consumer>
          {openingTimes => (
            <>
              <div className="container">
                <div className="grid">
                  <div
                    className={classNames({
                      [grid({ s: 12, l: 4, xl: 4 })]: true,
                      [font({ s: 'HNL5' })]: true,
                    })}
                  >
                    <FindUs />
                  </div>
                  <div
                    className={classNames({
                      [grid({ s: 12, l: 4, xl: 4 })]: true,
                      [font({ s: 'HNL5' })]: true,
                    })}
                  >
                    <h3
                      className={`footer__heading hidden is-hidden-s is-hidden-m ${font(
                        {
                          s: 'HNL5',
                        }
                      )}`}
                    >
                      {`Opening times:`}
                    </h3>
                    <Icon
                      name="clock"
                      extraClasses={`float-l ${spacing(
                        { s: 2, m: 2, l: 2, xl: 2 },
                        { margin: ['right'] }
                      )}`}
                    />
                    <div
                      className={classNames({
                        [font({
                          s: 'HNL5',
                        })]: true,
                        'float-l': true,
                      })}
                    >
                      <h4
                        className={classNames({
                          [font({ s: 'HNM5' })]: true,
                          'no-margin': true,
                        })}
                      >{`Today's opening times`}</h4>
                      <ul className="plain-list no-padding no-margin">
                        {openingTimes.collectionOpeningTimes.placesOpeningHours.map(
                          venue => {
                            const todaysHours = getTodaysVenueHours(venue);
                            return (
                              todaysHours && (
                                <li
                                  key={venue.name}
                                  className={classNames({
                                    [spacing(
                                      { s: 1 },
                                      { margin: ['top'] }
                                    )]: true,
                                  })}
                                >
                                  {venue.name.toLowerCase() === 'restaurant'
                                    ? 'Kitchen '
                                    : `${venue.name} `}
                                  {todaysHours.opens ? (
                                    <>
                                      <time>{todaysHours.opens}</time>
                                      {'—'}
                                      <time>{todaysHours.closes}</time>
                                    </>
                                  ) : (
                                    'closed'
                                  )}
                                </li>
                              )
                            );
                          }
                        )}
                      </ul>
                      <p
                        className={classNames({
                          [spacing({ s: 1 }, { margin: ['top'] })]: true,
                        })}
                      >
                        <a href="/opening-times">Opening times</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </OpeningTimesContext.Consumer>
        <Container>
          <SearchResults
            title={planList.value.title}
            items={planList.value.items}
          />
        </Container>
        <Container>
          <SearchResults
            title={findList.value.title}
            items={findList.value.items}
          />
        </Container>
        <Container>
          <SearchResults
            title={eatShopList.value.title}
            items={eatShopList.value.items}
          />
        </Container>
        <Container>
          <PrismicHtmlBlock
            html={lastPara.value}
            htmlSerialiser={defaultSerializer}
          />
        </Container>

        {/* <ContentPage
          id={page.id}
          Header={Header}
          Body={<Body body={body} pageId={page.id} />}
        />
       */}
      </PageLayout>
    );
  }
}

export default Page;
