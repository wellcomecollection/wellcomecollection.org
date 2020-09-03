import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import CovidSafetyMeasure from '@weco/common/views/components/CovidSafetyMeasure/CovidSafetyMeasure';

const KeepingYouSafePage = () => {
  return (
    <PageLayout
      title={'Keeping you safe'}
      description={`Get involved in shaping better website and gallery experiences for everyone. We’re looking for people to take part in online and in-person interviews, usability tests, surveys and more`}
      hideNewsletterPromo={true}
      url={{ pathname: `/keeping-you-safe` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={'what-we-do'}
      imageUrl={null}
      imageAltText={null}
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={null}
        title={'Keeping you safe'}
        ContentTypeInfo={null}
        Background={
          <HeaderBackground
            hasWobblyEdge={true}
            backgroundTexture={
              'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2Fad6bc55e-5b1a-4378-9917-1653de368548_turquoise_ls.svg'
            }
          />
        }
        backgroundTexture={headerBackgroundLs}
        FeaturedMedia={null}
        HeroPicture={null}
        highlightHeading={true}
      />

      <Space v={{ size: 'xl', properties: ['margin-top'] }}>
        <Space
          v={{
            size: 'xl',
            properties: ['padding-bottom'],
          }}
          className={`row`}
        >
          <div className="container">
            <div className="grid">
              <div
                className={grid({
                  s: 12,
                  m: 10,
                  shiftM: 1,
                  l: 8,
                  shiftL: 2,
                  xl: 8,
                  shiftXL: 2,
                })}
              >
                <div className="body-text spaced-text">
                  <p className="font-hnm font-size-3">
                    We've made a few changes to ensure you have a safe and enjoyable visit.
                  </p>

                  <h2>What you need to do</h2>

                  <CovidSafetyMeasure title={'Clean your hands regularly'} description={'As well as our usual hand-washing facilities, you’ll find hand sanitiser dispensers throughout the museum and library.'} icon={'washYourHands'} />

                  <CovidSafetyMeasure title={'Wear a face covering'} description={'Keep your nose and mouth covered, unless you’re exempt.'} icon={'wearAMask'} />

                  <CovidSafetyMeasure title={'Keep your distance'} description={'Please stay two metres away from people not in your household or bubble.'} icon={'keepYourDistance'} />

                  <CovidSafetyMeasure title={'Stay at home if you have Covid-19 symptoms'} description={'If you have a temperature or any other Covid-19 symptoms, please stay at home.'} icon={'stayAtHome'} />

                  <h2>How we're keeping you safe</h2>
                  <p>
                    <ul>
                      <li>Limiting the number of visitors each day with a free ticketing system. <a href="#">Book your ticket</a></li>
                      <li>Taking extra care with cleaning and closing every Monday for a deep clean</li>
                      <li>Providing hand sanitiser dispensers</li>
                      <li>Providing our staff with personal protective equipment (PPE)</li>
                      <li>Marking flexible, signposted routes around the building to help you explore with plenty of space</li>
                      <li>Cleaning our accessible resources regularly</li>
                      <li>Spreading out café seating and serving pre-packed food</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Space>
      </Space>
    </PageLayout>
  );
};

export default KeepingYouSafePage;
