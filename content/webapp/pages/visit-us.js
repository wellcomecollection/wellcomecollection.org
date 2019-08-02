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
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
import Icon from '@weco/common/views/components/Icon/Icon';
import FeaturedText from '@weco/common/views/components/FeaturedText/FeaturedText';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { defaultSerializer } from '@weco/common/services/prismic/html-serialisers';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
import Picture from '@weco/common/views/components/Picture/Picture';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import { getTodaysVenueHours } from '@weco/common/services/prismic/opening-times';
import {
  pictureImages,
  firstPara,
  planList,
  findList,
  eatShopList,
  lastPara,
} from '@weco/content/content/visit-us-content';
import VerticalSpace from '@weco/common/views/components/styled/VerticalSpace';

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

const BespokeBody = (
  <>
    <OpeningTimesContext.Consumer>
      {openingTimes => (
        <Container>
          <FeaturedText
            html={firstPara.value}
            htmlSerialiser={defaultSerializer}
          />
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
              <Icon name="clock" extraClasses={`float-l margin-right-12`} />
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
                      const todaysHours = getTodaysVenueHours(venue);
                      return (
                        todaysHours && (
                          <VerticalSpace
                            v={{
                              size: 's',
                              properties: ['margin-top'],
                            }}
                            as="li"
                            key={venue.name}
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
                          </VerticalSpace>
                        )
                      );
                    }
                  )}
                </ul>
                <VerticalSpace
                  v={{
                    size: 's',
                    properties: ['margin-top'],
                  }}
                  className={`no-margin`}
                >
                  <a href="/opening-times">Opening times</a>
                </VerticalSpace>
              </div>
            </div>
          </div>
        </Container>
      )}
    </OpeningTimesContext.Consumer>

    <Container>
      <SearchResults
        title={planList.value.title}
        items={planList.value.items}
      />
      <VerticalSpace
        v={{
          size: 'm',
          properties: ['padding-top'],
        }}
        className={classNames({
          grid: true,
        })}
      >
        <div
          className={classNames({
            [grid({ s: 12, l: 6, xl: 6 })]: true,
            [font('hnl', 4)]: true,
          })}
        >
          <VerticalSpace v={{ size: 'm', properties: ['margin-bottom'] }}>
            <MoreLink url={`/pages/Wuw19yIAAK1Z3Smk`} name={`Group visits`} />
          </VerticalSpace>
          <VerticalSpace v={{ size: 'm', properties: ['margin-bottom'] }}>
            <MoreLink url={`/pages/Wuw2MSIAACtd3StS`} name={`Schools`} />
          </VerticalSpace>
        </div>
        <div
          className={classNames({
            [grid({ s: 12, l: 6, xl: 6 })]: true,
            [font('hnl', 4)]: true,
          })}
        >
          <VerticalSpace v={{ size: 'm', properties: ['margin-bottom'] }}>
            <MoreLink url={`/pages/W1CenyYAACUAj4Oy`} name={`Families`} />
          </VerticalSpace>
          <VerticalSpace v={{ size: 'm', properties: ['margin-bottom'] }}>
            <MoreLink url={`/pages/Wuw2MSIAACtd3Ssg`} name={`Young people`} />
          </VerticalSpace>
        </div>
      </VerticalSpace>
    </Container>
    <Container>
      <SearchResults
        title={findList.value.title}
        items={findList.value.items}
      />
      <VerticalSpace
        v={{ size: 'm', properties: ['padding-top'] }}
        className={`grid`}
      >
        <div
          className={classNames({
            [grid({ s: 12, l: 6, xl: 6 })]: true,
            [font('hnl', 4)]: true,
          })}
        >
          <VerticalSpace v={{ size: 'm', properties: ['margin-bottom'] }}>
            <MoreLink
              url={`/pages/Wuw2MSIAACtd3SsC`}
              name={`Find out about venue hire`}
            />
          </VerticalSpace>
        </div>
      </VerticalSpace>
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
  </>
);

type Props = {|
  page: PageType,
|};

const backgroundTexture =
  'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';

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
    const DateInfo = page.datePublished && (
      <HTMLDate date={new Date(page.datePublished)} />
    );

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
              <SpacingSection>
                <div className="basic-page">{BespokeBody}</div>
              </SpacingSection>
            </div>
          </article>
        </PageLayout>
      </>
    );
  }
}

export default Page;
// TODO
// Main image
// What's On image
// Copy
// accessibility - why are card headings not marked up as headings?
