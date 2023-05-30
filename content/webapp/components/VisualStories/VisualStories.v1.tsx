import { PrototypeH1 } from './VisualStories.styles';
import Layout from '@weco/common/views/components/Layout/Layout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors/OnThisPageAnchors';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

export const V1Prototype = () => {
  const links = [
    {
      text: 'Introduction to Wellcome Collection',
      url: '#introduction-to-wellcome-collection',
    },
    { text: 'Quieter times to visit', url: '#quieter-times-to-visit' },
    {
      text: 'Getting to Wellcome Collection',
      url: '#getting-to-wellcome-collection',
    },
    { text: 'Arriving by tube or train', url: '#arriving-by-tube-or-train' },
    { text: 'Arriving by bus', url: '#arriving-by-bus' },
    { text: 'Arriving by bike', url: '#arriving-by-bike' },
    { text: 'Arriving by car', url: '#arriving-by-car' },
    { text: 'Access when you arrive', url: '#access-when-you-arrive' },
    { text: 'Gallery access provisions', url: '#gallery-access-provisions' },
  ];
  return (
    <>
      <Layout12>
        <PrototypeH1 className="h0">
          Wellcome Collection visual story
        </PrototypeH1>
      </Layout12>
      <Layout gridSizes={{ s: 12, m: 10, l: 8, xl: 8 }}>
        <p>
          This visual story is designed to help you prepare for your visit and
          to help you know what to expect upon arrival if you have autism and/or
          sensory sensitivities.
        </p>
      </Layout>
      <Layout8>
        <div className="body-text">
          <SpacingComponent>
            <OnThisPageAnchors links={links} />
          </SpacingComponent>

          <SpacingComponent>
            <h2 id="introduction-to-wellcome-collection">
              Introduction to Wellcome Collection
            </h2>
          </SpacingComponent>
        </div>
      </Layout8>
    </>
  );
};
