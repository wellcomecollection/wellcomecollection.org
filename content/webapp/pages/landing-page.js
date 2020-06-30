// @flow
import type { Context } from 'next';
import { Component } from 'react';
import Head from 'next/head';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { getPage } from '@weco/common/services/prismic/pages';
import { contentLd } from '@weco/common/utils/json-ld';
import { classNames, font, grid } from '@weco/common/utils/classnames';
import type { Page as PageType } from '@weco/common/model/pages';
import FindUs from '@weco/common/views/components/FindUs/FindUs';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
// import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
// import FeaturedText from '@weco/common/views/components/FeaturedText/FeaturedText';
// import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
// import { defaultSerializer } from '@weco/common/services/prismic/html-serializers';
// import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
import Picture from '@weco/common/views/components/Picture/Picture';
import { getTodaysVenueHours } from '@weco/common/services/prismic/opening-times';
import {
  pictureImages,
  // firstPara,
  // planList,
  // findList,
  // eatShopList,
  // lastPara,
} from '@weco/content/content/visit-us-content';
import Space from '@weco/common/views/components/styled/Space';
// import Contact from '@weco/common/views/components/Contact/Contact';
import VisitUsBody from '@weco/common/views/components/VisitUsBody/VisitUsBody';

import GridFactory from '@weco/common/views/components/GridFactory/GridFactory';
import WobblyEdge from '@weco/common/views/components/WobblyEdge/WobblyEdge';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import Card from '@weco/common/views/components/Card/Card';

/* <FeaturedText
html={firstPara.value}
htmlSerializer={defaultSerializer}
/> */

type Props = {|
  page: PageType,
|};

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

const backgroundTexture =
  'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';

export class Page extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { id, memoizedPrismic } = ctx.query;
    ctx.query.memoizedPrismic = undefined; // Once we've got memoizedPrismic, we need to remove it before making requests - otherwise we hit circular object issues with JSON.stringify
    const page = await getPage(ctx.req, id, memoizedPrismic);

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
    const DateInfo = page.datePublished && (
      <HTMLDate date={new Date(page.datePublished)} />
    );
    const hasFeaturedMedia =
      page.body.length > 1 &&
      (page.body[0].type === 'picture' || page.body[0].type === 'videoEmbed');
    const body = hasFeaturedMedia
      ? page.body.slice(1, page.body.length)
      : page.body;
    const filteredBody = body.filter(slice => slice.type === 'contentList');
    // TODO: This is not the way to do site sections
    const breadcrumbs = {
      items: page.siteSection
        ? [
            {
              text: 'Visit us',
              url: '',
            },
          ]
        : [],
    };

    const Header = (
      <PageHeader
        breadcrumbs={breadcrumbs}
        labels={null}
        title={page.title}
        isFree={true}
        FeaturedMedia={<Picture isFull={true} images={pictureImages} />}
        Background={
          <HeaderBackground
            hasWobblyEdge={true}
            backgroundTexture={backgroundTexture}
          />
        }
        ContentTypeInfo={DateInfo}
        HeroPicture={null}
        backgroundTexture={null}
        highlightHeading={true}
      />
    );
    const backgroundColors = ['white', 'cream', 'white', 'charcoal'];
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <PageLayout
          title={page.title}
          description={page.metadataDescription || page.promoText || ''}
          url={{ pathname: `/pages/${page.id}` }}
          jsonLd={contentLd(page)}
          openGraphType={'website'}
          siteSection={'visit-us'}
          imageUrl={page.image && convertImageUri(page.image.contentUrl, 800)}
          imageAltText={page.image && page.image.alt}
        >
          <article data-wio-id={page.id}>
            <SpacingSection>{Header}</SpacingSection>
            <div>
              {page.id === 'WwLIBiAAAPMiB_zC' && (
                <OpeningTimesContext.Consumer>
                  {openingTimes => (
                    <Container>
                      <div className="grid">
                        <div
                          className={classNames({
                            [grid({ s: 12, l: 6, xl: 6 })]: true,
                            [font('hnl', 4)]: true,
                          })}
                        >
                          <FindUs />
                        </div>
                        <div
                          className={classNames({
                            [grid({ s: 12, l: 6, xl: 6 })]: true,
                            [font('hnl', 4)]: true,
                          })}
                        >
                          <div className="flex">
                            <Space
                              as="span"
                              h={{ size: 'm', properties: ['margin-right'] }}
                            >
                              <Icon name="clock" extraClasses={`float-l`} />
                            </Space>
                            <div
                              className={classNames({
                                [font('hnl', 5)]: true,
                                'float-l': true,
                              })}
                            >
                              <h2
                                className={classNames({
                                  [font('hnm', 5)]: true,
                                  'no-margin': true,
                                })}
                              >{`Today's opening times`}</h2>
                              <ul className="plain-list no-padding no-margin">
                                {openingTimes.collectionOpeningTimes.placesOpeningHours.map(
                                  venue => {
                                    const todaysHours = getTodaysVenueHours(
                                      venue
                                    );
                                    return (
                                      todaysHours && (
                                        <Space
                                          v={{
                                            size: 's',
                                            properties: ['margin-top'],
                                          }}
                                          as="li"
                                          key={venue.name}
                                        >
                                          {venue.name.toLowerCase() ===
                                          'restaurant'
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
                                        </Space>
                                      )
                                    );
                                  }
                                )}
                              </ul>
                              <Space
                                v={{
                                  size: 's',
                                  properties: ['margin-top'],
                                }}
                                className={`no-margin`}
                              >
                                <a href="/opening-times">Opening times</a>
                              </Space>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Container>
                  )}
                </OpeningTimesContext.Consumer>
              )}
              {/* TODO use parsers */}
              {/* TODO why no links? */}
              <SpacingSection>
                <div className="basic-page">
                  {filteredBody.map((slice, index) => {
                    const backgroundColor =
                      backgroundColors[index % backgroundColors.length];
                    const cards = slice.value.items.map((item, i) => (
                      <Card
                        key={i}
                        item={{
                          // format: {
                          //   id: item.id,
                          //   title: item.type,
                          // },
                          title: item.title,
                          description: item.promo.caption,
                          image: {
                            contentUrl: item.promo.image.contentUrl,
                            alt: '',
                            width: 1600,
                            height: 900,
                            crops: {
                              '16:9': {
                                contentUrl: item.image.crops['16:9'].contentUrl,
                                alt: '',
                                width: 1600,
                                height: 900,
                              },
                            },
                          },
                          link: item.promo.link,
                        }}
                      />
                    ));
                    return (
                      <SpacingSection key={index}>
                        <WobblyEdge background={backgroundColor} isStatic />
                        <Space
                          v={{
                            size: 'xl',
                            properties: ['padding-top', 'padding-bottom'],
                          }}
                          className={`row bg-${backgroundColor}`}
                        >
                          {slice.value.title && (
                            <Space
                              v={{ size: 'l', properties: ['margin-bottom'] }}
                            >
                              <SectionHeader title={slice.value.title} />
                            </Space>
                          )}
                          {/* TODO first card (and hasFeatured?)
                          {slice.featuredItem && (
                            <Space
                              v={{ size: 'l', properties: ['margin-bottom'] }}
                            >
                              <Layout12>{slice.featuredItem}</Layout12>
                            </Space>
                          )} */}
                          <GridFactory items={cards} />
                        </Space>
                        <WobblyEdge background={'white'} isStatic />
                      </SpacingSection>
                    );
                  })}
                  <VisitUsBody />
                </div>
              </SpacingSection>
            </div>
          </article>
        </PageLayout>
      </>
    );
  }
}

export default Page;
