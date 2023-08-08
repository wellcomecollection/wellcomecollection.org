import { TwoUp, NoSpacedText, PrototypeH2 } from './VisualStories.styles';
import Layout from '@weco/common/views/components/Layout/Layout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors/OnThisPageAnchors';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import { anchorLinks } from './VisualStories.data';
import Contact from '@weco/common/views/components/Contact/Contact';
import { font } from '@weco/common/utils/classnames';

export const V1Prototype = () => {
  return (
    <>
      <Layout12>
        <h1 className={font('wb', 1)}>Wellcome Collection visual story</h1>
      </Layout12>
      <Layout gridSizes={{ s: 12, m: 10, l: 8, xl: 8 }}>
        <p style={{ marginBottom: '1rem' }}>
          This visual story is designed to help you prepare for your visit and
          to help you know what to expect upon arrival if you have autism and/or
          sensory sensitivities.
        </p>
        <p className={font('intr', 6)}>Updated DD Month 2023</p>
      </Layout>
      <Layout8>
        <SpacingSection>
          <OnThisPageAnchors links={anchorLinks} />
        </SpacingSection>
        <div className="body-text spaced-text">
          <SpacingComponent>
            <PrototypeH2
              isFirst={true}
              id="introduction-to-wellcome-collection"
            >
              Introduction to Wellcome Collection
            </PrototypeH2>
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
                  style={{ width: '295px', maxWidth: '100%' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/6-quieter-morning.png"
                />
                <p>Mornings are usually the quietest times to visit.</p>
              </div>
              <div>
                <img
                  style={{ width: '303px', maxWidth: '100%' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/7-louder-weekend.png"
                />
                <p>Weekends are much busier and louder than weekdays.</p>
              </div>
            </TwoUp>
          </SpacingComponent>
          <SpacingComponent>
            <PrototypeH2 id="getting-to-wellcome-collection">
              Getting to Wellcome Collection
            </PrototypeH2>
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
          <SpacingComponent>
            <p>
              If you would like one of our staff to meet you at a nearby
              station, our <strong>Visitor Experience team</strong> can help you
              make your way to our building.
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
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/19-a-maps.png"
            />
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
            <PrototypeH2 id="access-when-you-arrive">
              Access when you arrive
            </PrototypeH2>
            <p>
              When you enter the building, there is a short flight of steps or a
              platform lift up to level 0, where there is a café and shop, and
              an Information Point. The entrance is bright and can sometimes be
              noisy and busy.
            </p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/20-2-up-bag-check.png"
            />
            <p>
              A member of our security team may ask to check your bag when you
              enter.
            </p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/21-info-point.png"
            />
            <p>This is what the information point looks like.</p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/22-vea.png"
            />
            <p>
              Members of our Visitor Experience Team will be at the Information
              Point and work throughout the building.
            </p>
            <p>
              They wear black tops with the words “Ask me” on them. You can ask
              them for directions or assistance at any time.
            </p>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/23-lifts-stairs.png"
            />
            <img
              style={{ width: '200px' }}
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/24-wheelchair-lift-icons.png"
            />
            <p>
              There is step-free and level access to all floors of the building
              via the lifts.{' '}
            </p>
            <img
              style={{ width: '50%' }}
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/25-accessible-toilet.png"
            />
            <br />
            <img
              style={{ width: '100px' }}
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/26-access-baby-change-icon.png"
            />
            <p>There are accessible toilets on all floors of the building.</p>
            <p>There is a Changing Places toilet on level 0.</p>
            <h3 id="gallery-access-provisions">Gallery access provisions</h3>
            <img
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/27-access-provision-icons.png"
            />
            <p>
              Ear defenders, tinted glasses, tinted visors and weighted lap pads
              are available.
            </p>
            <p>
              Please ask a member of gallery staff if you would like any of
              these things.
            </p>
            <img
              style={{ width: '100px' }}
              alt=""
              src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/28-wheelchair-icon.png"
            />
            <p>You can borrow a wheelchair during your visit.</p>
            <p>
              To borrow a wheelchair, contact our Visitor Experience Team or ask
              at the Information Point on level 0.
            </p>
          </SpacingComponent>
        </div>
      </Layout8>
    </>
  );
};
