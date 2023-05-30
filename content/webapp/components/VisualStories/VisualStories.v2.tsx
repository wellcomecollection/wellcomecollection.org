import styled from 'styled-components';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { PrototypeH1 } from './VisualStories.styles';
import Layout from '@weco/common/views/components/Layout/Layout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors/OnThisPageAnchors';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { anchorLinks } from './VisualStories.data';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';

const Division = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};

  p {
    margin: 0 45px 0 0;
    flex: 1 1 calc(50% - 45px);
  }

  span {
    margin-left: 45px;
    flex: 1 1 calc(50% - 45px);
  }
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
          <SpacingComponent>
            <h2 id="introduction-to-wellcome-collection">
              Introduction to Wellcome Collection
            </h2>
          </SpacingComponent>

          <SpacingComponent>
            <span>
              <img
                src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/1-building-entrance.png"
                alt=""
              />
            </span>

            <Division>
              <p>Wellcome Collection is a free museum.</p>

              <span>
                <img
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/2-free-icon.png"
                  alt=""
                  style={{ maxWidth: '100px' }}
                />
              </span>
            </Division>

            <Division>
              <p>It is closed on Mondays.</p>

              <span>
                <img
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/3-closed-monday.png"
                  alt=""
                  style={{ maxWidth: '200px' }}
                />
              </span>
            </Division>

            <Division>
              <p>
                It is open from 10am to 6pm on Tuesdays, Wednesdays, Fridays,
                Saturdays and Sundays.
              </p>

              <span>
                <img
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/4-open-normal.png"
                  alt=""
                  style={{ maxWidth: '300px' }}
                />
              </span>
            </Division>

            <Division>
              <p>It is open from 10am to 8pm on Thursdays.</p>

              <span>
                <img
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/5-open-thursday.png"
                  alt=""
                  style={{ maxWidth: '300px' }}
                />
              </span>
            </Division>
          </SpacingComponent>
        </div>
      </Layout8>
    </>
  );
};
