import styled from 'styled-components';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import {
  PrototypeH1,
  YellowBox,
  YellowBoxInner,
  TODO,
} from './VisualStories.styles';
import Layout from '@weco/common/views/components/Layout/Layout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors/OnThisPageAnchors';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { anchorLinks } from './VisualStories.data';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import theme from '@weco/common/views/themes/default';

const Division = styled(Space)`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
  padding: 40px 0;
`;

const LeftHandSide = styled.div`
  margin: 0 45px 0 0;
  flex: 1 1 calc(50% - 45px);
`;

const RightHandSide = styled.div`
  margin-left: 45px;
  flex: 1 1 calc(50% - 45px);
`;

const Flex = styled.div`
  display: flex;
  padding-top: 40px;
`;

export const V2Prototype = () => {
  return (
    <>
      <Layout12>
        <PrototypeH1>Wellcome Collection visual story</PrototypeH1>
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

        <div className="body-text">
          {/* Introduction to Wellcome Collection */}
          <SpacingSection>
            <h2 id="introduction-to-wellcome-collection">
              Introduction to Wellcome Collection
            </h2>

            <SpacingComponent>
              <span>
                <img
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/1-building-entrance.png"
                  alt=""
                />
              </span>

              <Division>
                <LeftHandSide>
                  <p>Wellcome Collection is a free museum.</p>
                </LeftHandSide>

                <RightHandSide>
                  <img
                    src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/2-free-icon.png"
                    alt=""
                    style={{ maxWidth: '100px' }}
                  />
                </RightHandSide>
              </Division>

              <Division>
                <LeftHandSide>
                  <p>It is closed on Mondays.</p>
                </LeftHandSide>

                <RightHandSide>
                  <img
                    src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/3-closed-monday.png"
                    alt=""
                    style={{ maxWidth: '200px' }}
                  />
                </RightHandSide>
              </Division>

              <Division>
                <LeftHandSide>
                  <p>
                    It is open from 10am to 6pm on Tuesdays, Wednesdays,
                    Fridays, Saturdays and Sundays.
                  </p>
                </LeftHandSide>

                <RightHandSide>
                  <img
                    src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/4-open-normal.png"
                    alt=""
                    style={{ maxWidth: '300px' }}
                  />
                </RightHandSide>
              </Division>

              <Division>
                <LeftHandSide>
                  <p>It is open from 10am to 8pm on Thursdays.</p>
                </LeftHandSide>

                <RightHandSide>
                  <img
                    src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/5-open-thursday.png"
                    alt=""
                    style={{ maxWidth: '300px' }}
                  />
                </RightHandSide>
              </Division>
            </SpacingComponent>

            <SpacingComponent>
              <h3 id="quieter-times-to-visit">Quieter times to visit</h3>
              <Division
                style={{
                  borderColor: theme.color('black'),
                  padding: '0 0 40px',
                }}
              >
                <LeftHandSide
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/6-quieter-morning.png"
                    alt=""
                    style={{ maxWidth: '200px' }}
                  />
                  <p>Mornings are usually the quietest times to visit.</p>
                </LeftHandSide>
                <RightHandSide
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/7-louder-weekend.png"
                    alt=""
                    style={{ maxWidth: '200px' }}
                  />
                  <p>Weekends are much busier and louder than weekdays.</p>
                </RightHandSide>
              </Division>
            </SpacingComponent>
          </SpacingSection>

          {/* Getting to Wellcome Collection */}
          <SpacingSection>
            <h2 id="getting-to-wellcome-collection">
              Getting to Wellcome Collection
            </h2>

            <Division>
              <LeftHandSide>
                <p>
                  Our address is Wellcome Collection, 183 Euston Road, London
                  NW1 2BE.
                </p>
              </LeftHandSide>

              <RightHandSide>
                <img
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/8-location-icon.png"
                  alt=""
                  style={{ maxWidth: '100px' }}
                />
              </RightHandSide>
            </Division>

            <Division>
              <LeftHandSide>
                <p>
                  We are a big stone building on Euston Road. This is what the
                  building looks like from the outside.{' '}
                </p>
              </LeftHandSide>

              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/9-building.png"
                />
              </RightHandSide>
            </Division>

            <Division>
              <LeftHandSide>
                <p>You can enter through the two revolving doors.</p>
              </LeftHandSide>

              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/10-building-revolving-doors.png"
                />
              </RightHandSide>
            </Division>

            <Division>
              <LeftHandSide>
                <p>Or via the accessible door in between them.</p>
              </LeftHandSide>

              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/11-building-accessible-door.png"
                />
              </RightHandSide>
            </Division>

            <Division>
              <LeftHandSide>
                <p>You can reach us by train, Underground, bus, bike or car.</p>
              </LeftHandSide>

              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/12-v2-transport.png"
                  style={{ maxWidth: '300px' }}
                />
              </RightHandSide>
            </Division>

            <Flex>
              <LeftHandSide>
                <h3 id="arriving-by-tube-or-train">
                  Arriving by tube{' '}
                  <span style={{ fontWeight: 'normal' }}>or</span> train
                </h3>
              </LeftHandSide>

              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/12-v2-a-train-tube.png"
                  style={{ maxWidth: '200px' }}
                />
              </RightHandSide>
            </Flex>

            <span>
              <p>The nearest tube and train stations are:</p>
              <img
                alt=""
                src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/13-3-up-train-stations.png"
              />
            </span>
            <TODO>TODO add station names or discuss with Dom</TODO>
          </SpacingSection>

          {/* Yellow box */}
          <SpacingSection>
            <YellowBox>
              <YellowBoxInner>
                <p>
                  If you would like one of <strong>our staff</strong> to{' '}
                  <strong>meet you</strong> at a nearby station, please contact
                  our <strong>Visitor Experience Team</strong>.
                </p>
                <p>They can help you make your way to our building.</p>
                <p>
                  <strong>Contact our Visitor Experience Team:</strong>
                </p>

                <p style={{ marginBottom: 0 }}>
                  <strong>By phone</strong>
                </p>
                <p>+44 (0)20 7611 2222</p>

                <p style={{ marginBottom: 0 }}>
                  Or <strong>by email</strong>
                </p>
                <p>info@wellcomecollection.org</p>
                <TODO>Add icons</TODO>
              </YellowBoxInner>
            </YellowBox>
          </SpacingSection>

          {/* Arriving by bus/bike/car */}
          <SpacingSection>
            <Division>
              <LeftHandSide>
                <h3 id="arriving-by-bus">Arriving by bus</h3>

                <p>
                  These buses stop close to our main entrance at 183 Euston
                  Road: 18, 30, 73, 205, 390.
                </p>
                <p>This is what the nearest bus stop looks like.</p>
              </LeftHandSide>

              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/14-bus-stop.png"
                />
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/14-a-bus-icon.png"
                  style={{ width: '100px' }}
                />
              </RightHandSide>
            </Division>

            <Division>
              <LeftHandSide>
                <h3 id="arriving-by-bike">Arriving by bike</h3>
                <p>
                  There are folding bike lockers in the locker room on level 0
                  of Wellcome Collection.
                </p>
                <p>You can park non-folding bikes at Euston Station.</p>
              </LeftHandSide>
              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/15-bike-lockers.png"
                />
                <img
                  style={{ width: '200px' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/16-bike-icons.png"
                />
              </RightHandSide>
            </Division>

            <Division>
              <LeftHandSide>
                <h3 id="arriving-by-car">Arriving by car</h3>
                <p>
                  There are parking spaces for Blue Badge holders. To book a
                  space, contact the Visitor Experience Team.
                </p>
              </LeftHandSide>
              <RightHandSide>
                <img
                  style={{ width: '200px' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/17-car-icons.png"
                />
              </RightHandSide>
            </Division>

            <Flex>
              <LeftHandSide>
                <p>
                  If you are arriving by taxi, please ask to be dropped off at:
                </p>
                <p>42 Gower Place London WC1E 2BN</p>
              </LeftHandSide>
              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/18-back-entrance.png"
                />
                <img
                  style={{ width: '200px' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/19-taxi-location-icons.png"
                />
              </RightHandSide>
            </Flex>
            <Division style={{ borderColor: theme.color('black') }}>
              <LeftHandSide>
                <p>
                  Gower Place is at the back of the Wellcome Collection
                  building.
                </p>
                <p>
                  You will need to enter via the main entrance which is at 183
                  Euston Road.
                </p>
                <p>The main entrance is around the corner from Gower Place.</p>
                <p>
                  If you would like one of our staff to meet you at a Gower
                  Place and take you to the main entrance, please contact our
                  Visitor Experience Team.
                </p>
              </LeftHandSide>
              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/19-b-maps.png"
                />
              </RightHandSide>
            </Division>
          </SpacingSection>

          {/* Access when you arrive */}
          <SpacingSection>
            <h2 id="access-when-you-arrive">Access when you arrive</h2>

            <div
              style={{
                borderBottom: `1px solid ${theme.color('warmNeutral.400')}`,
              }}
            >
              <p>
                When you enter the building, there is a short flight of steps or
                a platform lift up to level 0, where there is a café and shop,
                and an Information Point. The entrance is bright and can
                sometimes be noisy and busy.
              </p>
              <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/20-2-up-bag-check.png"
                />
              </Space>
              <p>
                A member of our security team may ask to check your bag when you
                enter.
              </p>
            </div>

            <Division>
              <LeftHandSide>
                <p>This is what the information point looks like.</p>
              </LeftHandSide>
              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/21-info-point.png"
                />
              </RightHandSide>
            </Division>

            <div
              style={{
                marginTop: '40px',
                borderBottom: `1px solid ${theme.color('warmNeutral.400')}`,
              }}
            >
              <img
                alt=""
                src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/22-vea.png"
              />
              <p>
                Members of our Visitor Experience Team will be at the
                Information Point and work throughout the building.
              </p>
              <p>
                They wear black tops with the words “Ask me” on them. You can
                ask them for directions or assistance at any time.
              </p>
            </div>

            <Division>
              <LeftHandSide>
                <p>
                  There is step-free and level access to all floors of the
                  building via the lifts.{' '}
                </p>
              </LeftHandSide>
              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/23-lifts-stairs.png"
                />
                <img
                  style={{ width: '200px' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/24-wheelchair-lift-icons.png"
                />
              </RightHandSide>
            </Division>

            <Division>
              <LeftHandSide>
                <p>
                  There are accessible toilets on all floors of the building.
                </p>
                <p>There is a Changing Places toilet on level 0.</p>
              </LeftHandSide>
              <RightHandSide>
                <img
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/25-accessible-toilet.png"
                />
                <img
                  style={{ width: '100px' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/26-access-baby-change-icon.png"
                />
              </RightHandSide>
            </Division>

            <Division>
              <LeftHandSide>
                <h3 id="gallery-access-provisions">
                  Gallery access provisions
                </h3>
                <p>
                  Ear defenders, tinted glasses, tinted visors and weighted lap
                  pads are available.
                </p>
                <p>
                  Please ask a member of gallery staff if you would like any of
                  these things.
                </p>
              </LeftHandSide>
              <RightHandSide>
                <img
                  alt=""
                  style={{ maxWidth: '200px' }}
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/27-v2-access-provisions.png"
                />
              </RightHandSide>
            </Division>

            <Division>
              <LeftHandSide>
                <p>You can borrow a wheelchair during your visit.</p>
                <p>
                  To borrow a wheelchair, contact our Visitor Experience Team or
                  ask at the Information Point on level 0.
                </p>
              </LeftHandSide>
              <RightHandSide>
                <img
                  style={{ width: '100px' }}
                  alt=""
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/28-wheelchair-icon.png"
                />
              </RightHandSide>
            </Division>
          </SpacingSection>
        </div>
      </Layout8>
    </>
  );
};
