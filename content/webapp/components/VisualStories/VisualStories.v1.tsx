import { PrototypeH1, TwoUp } from './VisualStories.styles';
import Layout from '@weco/common/views/components/Layout/Layout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors/OnThisPageAnchors';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { anchorLinks } from './VisualStories.data';

export const V1Prototype = () => {
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

            <h3>Quieter times to visit</h3>
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
          <SpacingComponent></SpacingComponent>
        </div>
      </Layout8>
    </>
  );
};
