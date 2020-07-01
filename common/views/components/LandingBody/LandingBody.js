// @flow
import { type Weight } from '../../../services/prismic/parsers';
import { defaultSerializer } from '../../../services/prismic/html-serializers';
import { classNames, font, grid } from '@weco/common/utils/classnames';
import { getTodaysVenueHours } from '@weco/common/services/prismic/opening-times';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
import FeaturedText from '../FeaturedText/FeaturedText';
import Layout12 from '../Layout12/Layout12';
import Layout8 from '../Layout8/Layout8';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
import FindUs from '@weco/common/views/components/FindUs/FindUs';
import SpacingSection from '../SpacingSection/SpacingSection';
import GridFactory from '../GridFactory/GridFactory';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import SectionHeader from '../SectionHeader/SectionHeader';
import Card from '../Card/Card';
import FeaturedCard from '../FeaturedCard/FeaturedCard';

type ContainerProps = {|
  children: any,
|};

const Container = ({ children }: ContainerProps) => (
  <SpacingSection>
    <SpacingComponent>
      <div
        className={classNames({
          'body-part': true,
        })}
      >
        <Layout8>{children}</Layout8>
      </div>
    </SpacingComponent>
  </SpacingSection>
);

type BodySlice = {|
  type: string,
  weight: Weight,
  value: any,
|};

export type BodyType = BodySlice[];

type Props = {|
  body: BodyType,
  isDropCapped?: boolean,
  pageId: string,
|};

const Body = ({ body, isDropCapped, pageId }: Props) => {
  const featuredText = body.find(slice => slice.type === 'standfirst');
  const sections = body.filter(slice => slice.type === 'contentList');
  const sectionThemes = [
    {
      rowBackground: 'white',
      cardBackground: 'cream',
      featuredCardBackground: 'charcoal',
      featuredCardText: 'white',
    },
    {
      rowBackground: 'cream',
      cardBackground: 'white',
      featuredCardBackground: 'white',
      featuredCardText: 'black',
    },
    {
      rowBackground: 'white',
      cardBackground: 'cream',
      featuredCardBackground: 'cream',
      featuredCardText: 'black',
    },
    {
      rowBackground: 'charcoal',
      cardBackground: 'transparent',
      featuredCardBackground: 'white',
      featuredCardText: 'black',
    },
  ];

  return (
    <div
      className={classNames({
        'basic-body': true,
      })}
    >
      {/*  'Visit us' specific content */}
      {pageId === 'XvxzjhQAAJmq1t__' && ( // TODO move this out
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
                            const todaysHours = getTodaysVenueHours(venue);
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
      {/*  end of 'Visit us' specific content */}
      {featuredText && (
        <Layout8>
          <SpacingSection>
            <div className="body-text spaced-text">
              <FeaturedText
                html={featuredText.value}
                htmlSerializer={defaultSerializer}
              />
            </div>
          </SpacingSection>
        </Layout8>
      )}
      {sections.map((section, index) => {
        const sectionTheme = sectionThemes[index % sectionThemes.length];
        const hasFeatured =
          Boolean(section.value.hasFeatured) ||
          section.value.items.length === 1;
        const firstItem = section.value.items[0];
        const cardItems = hasFeatured
          ? section.value.items.slice(1)
          : section.value.items;
        // TODO better way of parsing these
        const featuredItem = hasFeatured ? (
          <FeaturedCard
            image={{
              contentUrl: firstItem.promo.image.contentUrl,
              alt: '',
              width: 1600,
              height: 900,
              crops: {
                '16:9': {
                  contentUrl: firstItem.image.crops['16:9'].contentUrl,
                  alt: '',
                  width: 1600,
                  height: 900,
                },
              },
            }}
            labels={[]}
            link={{
              url: firstItem.promo.link,
              text: firstItem.title,
            }}
            background={sectionTheme.featuredCardBackground}
            color={sectionTheme.featuredCardText}
            isReversed={section.value.items.length === 1}
          >
            <h2 className="font-wb font-size-2">{firstItem.title}</h2>
            <p className="font-hnl font-size-5">{firstItem.promo.caption}</p>
          </FeaturedCard>
        ) : null;
        const cards = cardItems.map((item, i) => (
          <Card
            key={i}
            item={{
              format: {
                id: item.id,
                title: item.type,
              },
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
            <WobblyEdge background={sectionTheme.rowBackground} isStatic />
            <Space
              v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
              className={classNames({
                'row card-theme': true,
                [`bg-${sectionTheme.rowBackground}`]: true,
                [`card-theme--${sectionTheme.cardBackground}`]: true,
              })}
            >
              {section.value.title && (
                <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                  <SectionHeader title={section.value.title} />
                </Space>
              )}
              {featuredItem && (
                <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                  <Layout12>{featuredItem}</Layout12>
                </Space>
              )}
              {cards.length > 0 && <GridFactory items={cards} />}
            </Space>
            <WobblyEdge background={'white'} isStatic />
          </SpacingSection>
        );
      })}
    </div>
  );
};

export default Body;
