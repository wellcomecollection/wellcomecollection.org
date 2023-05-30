import { TwoUp, NoSpacedText } from './VisualStories.styles';
import Layout from '@weco/common/views/components/Layout/Layout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors/OnThisPageAnchors';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { anchorLinks } from './VisualStories.data';
import Contact from '@weco/common/views/components/Contact/Contact';

export const V1Prototype = () => {
  return (
    <>
      <Layout12>
        <h1 className="h0">Wellcome Collection visual story</h1>
      </Layout12>
      <Layout gridSizes={{ s: 12, m: 10, l: 8, xl: 8 }}>
        <p>
          This visual story is designed to help you prepare for your visit and
          to help you know what to expect upon arrival if you have autism and/or
          sensory sensitivities.
        </p>
      </Layout>
      <Layout8>
        <SpacingSection>
          <OnThisPageAnchors links={anchorLinks} />
        </SpacingSection>
        <div className="body-text spaced-text">
          <SpacingComponent>
            <h2 id="introduction-to-wellcome-collection">
              Introduction to Wellcome Collection
            </h2>
          </SpacingComponent>
          <SpacingComponent>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/1-building-entrance.png"
            />
            <img
              style={{ width: '100px' }}
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/2-free-icon.png"
            />
            <p>Wellcome Collection is a free museum.</p>
            <p>It is closed on Mondays.</p>
            <p>
              It is open from 10am to 6pm on Tuesdays, Wednesdays, Fridays,
              Saturdays and Sundays.
            </p>
            <p>It is open from 10am to 8pm on Thursdays.</p>

            <h3 id="quieter-times-to-visit">Quieter times to visit</h3>
            <TwoUp>
              <div>
                <img
                  style={{ width: '247px' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/6-quieter-morning.png"
                />
                <p>Mornings are usually the quietest times to visit.</p>
              </div>
              <div>
                <img
                  style={{ width: '302px' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/7-louder-weekend.png"
                />
                <p>Weekends are much busier and louder than weekdays.</p>
              </div>
            </TwoUp>
          </SpacingComponent>
          <SpacingComponent>
            <h2 id="getting-to-wellcome-collection">
              Getting to Wellcome Collection
            </h2>
            <p>
              Our address is Wellcome Collection, 183 Euston Road, London NW1
              2BE.
            </p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/9-building.png"
            />
            <p>
              We are a big stone building on Euston Road. This is what the
              building looks like from the outside.{' '}
            </p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/10-building-revolving-doors.png"
            />
            <p>You can enter through the two revolving doors.</p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/11-building-accessible-door.png"
            />
            <p>Or via the accessible door in between them.</p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/12-transport-icons.png"
            />
            <p>You can reach us by train, Underground, bus, bike or car.</p>

            <h3 id="arriving-by-tube-or-train">Arriving by tube or train</h3>
            <p>
              The nearest tube and train stations are Euston Square, Euston and
              Warren Street.
            </p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/13-3-up-train-stations.png"
            />
          </SpacingComponent>
          <SpacingComponent>Yellow Box</SpacingComponent>
          <SpacingComponent>
            <h3 id="arriving-by-bus">Arriving by bus</h3>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/14-bus-stop.png"
            />
            <img
              style={{ width: '105px' }}
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/14-a-bus-icon.png"
            />
            <p>
              These buses stop close to our main entrance at 183 Euston Road:
              18, 30, 73, 205, 390.
            </p>
            <p>This is what the nearest bus stop looks like.</p>
            <h3 id="arriving-by-bike">Arriving by bike</h3>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/15-bike-lockers.png"
            />
            <img
              style={{ width: '200px' }}
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/16-bike-icons.png"
            />
            <p>
              There are folding bike lockers in the locker room on level 0 of
              Wellcome Collection.
            </p>
            <p>You can park non-folding bikes at Euston Station.</p>
            <h3 id="arriving-by-car">Arriving by car</h3>
            <img
              style={{ width: '200px' }}
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/17-car-icons.png"
            />
            <p>
              There are parking spaces for Blue Badge holders. To book a space,
              contact the Visitor Experience Team.
            </p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/18-back-entrance.png"
            />
            <img
              style={{ width: '200px' }}
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/19-taxi-location-icons.png"
            />
            <p>
              If you are arriving by taxi, please ask to be dropped off at 42
              Gower Place London WC1E 2BN
            </p>
            <TwoUp>
              <div>Map 1</div>
              <div>Map 2</div>
            </TwoUp>
            <p>
              Gower Place is at the back of the Wellcome Collection building.
            </p>
            <p>
              You will need to enter via the main entrance which is at 183
              Euston Road.
            </p>
            <p>The main entrance is around the corner from Gower Place.</p>
            <p>
              If you would like one of our staff to meet you at a Gower Place
              and take you to the main entrance, please contact our Visitor
              Experience Team.
            </p>
            <NoSpacedText>
              <Contact
                email="info@wellcomecollection.org"
                phone="+44 (0)20 7611 2222"
                title="Visitor experience"
                subtitle=""
              />
            </NoSpacedText>
          </SpacingComponent>
        </div>
      </Layout8>
    </>
  );
};
