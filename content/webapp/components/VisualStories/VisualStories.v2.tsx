import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { PrototypeH1 } from './VisualStories.styles';
import Layout from '@weco/common/views/components/Layout/Layout';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors/OnThisPageAnchors';
import { anchorLinks } from './VisualStories.data';

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
        <OnThisPageAnchors links={anchorLinks} />
      </Layout8>
    </>
  );
};
