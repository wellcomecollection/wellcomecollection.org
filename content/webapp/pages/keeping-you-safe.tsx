import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import CovidSafetyMeasure from '@weco/common/views/components/CovidSafetyMeasure/CovidSafetyMeasure';
import CovidInfoCard from '@weco/common/views/components/CovidInfoCard/CovidInfoCard';

const KeepingYouSafePage = () => {
  return (
    <PageLayout
      title={'Keeping you safe'}
      description={`Keeping you safe during your visit to Wellcome Collection`}
      url={{ pathname: `/keeping-you-safe` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={'visit-us'}
      imageUrl={null}
      imageAltText={null}
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={null}
        title={'Keeping you safe'}
        ContentTypeInfo={null}
        Background={null}
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
                    We’ve made a few changes to ensure you have a safe and enjoyable visit.
                  </p>

                  <h2>What you need to do</h2>

                  <CovidSafetyMeasure title={'Clean your hands regularly'} description={'As well as our usual hand-washing facilities, you’ll find hand sanitiser dispensers throughout the museum and library.'} icon={'washYourHands'} />

                  <CovidSafetyMeasure title={'Wear a face covering'} description={'Keep your nose and mouth covered, unless you’re exempt.'} icon={'wearAMask'} />

                  <CovidSafetyMeasure title={'Keep your distance'} description={'Please stay two metres away from people not in your household or bubble.'} icon={'keepYourDistance'} />

                  <CovidSafetyMeasure title={'Stay at home if you have Covid-19 symptoms'} description={'If you have a temperature or any other Covid-19 symptoms, please stay at home.'} icon={'stayAtHome'} />

                  <h2>How we’re keeping you safe</h2>
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


            <Space
              v={{size: 'xl', properties: ['margin-top']}}
              className={grid({
                s: 12,
                m: 12,
                l: 10,
                shiftL: 1,
                xl: 10,
                shiftXL: 1,
              })}>
              <div className="grid">
                <Space v={{size: 'l', properties: ['margin-bottom']}} className={classNames({
                  [grid({s: 12, m: 6, l: 6, xl: 6})]: true,
                })}>
                  <CovidInfoCard
                    icon={'bookATicket'}
                    title={'Book your ticket'}
                    description={<><p>It’s still free to visit our museum and library. You’ll just need to choose a time slot and book a ticket before you arrive.</p><p>This is so we can manage visitor numbers and allow plenty of space for social distancing.</p><p>You can explore the museum for as long as you’d like, but library sessions are now limited to either a morning or an afternoon. Library tickets include museum entry, too.</p></>}
                    link={'#'}
                    linkText={'Book your ticket'}
                  />
                </Space>
                <Space v={{size: 'l', properties: ['margin-bottom']}}className={classNames({
                  [grid({s: 12, m: 6, l: 6, xl: 6})]: true,
                })}>
                  <CovidInfoCard
                    icon={'wearAMask'}
                    title={'Keeping you safe'}
                    description={<><p>Keep your nose and mouth covered inside the building, unless you’re unable to. If you have a temperature or any other Covid-19 symptoms, please stay at home.</p><p>Inside, please go with the flow and follow marked routes, using the stairs if you can.</p><p>We’re taking extra measures to keep you safe, such as closing on Mondays for a deep clean.</p></>}
                    link={'#'}
                    linkText={'Keeping you safe'}
                  />
                </Space>
              </div>
            </Space>
          </div>
        </Space>
      </Space>
    </PageLayout>
  );
};

export default KeepingYouSafePage;
