import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ContactSlice as RawContactSlice } from '@weco/common/prismicio-types';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformContactSlice } from '@weco/content/services/prismic/transformers/body';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import Contact from '@weco/content/views/components/Contact';

export type ContactProps = SliceComponentProps<
  RawContactSlice,
  SliceZoneContext
>;

const ContactSlice: FunctionComponent<ContactProps> = ({ slice, context }) => {
  const transformedSlice = transformContactSlice(slice);
  if (transformedSlice) {
    return (
      <SpacingComponent $sliceType={transformedSlice.type}>
        <ConditionalWrapper
          condition={!!context.gridSizes}
          wrapper={children => (
            <ContaineredLayout gridSizes={context.gridSizes!}>
              {children}
            </ContaineredLayout>
          )}
        >
          <Contact {...transformedSlice.value} />
        </ConditionalWrapper>
      </SpacingComponent>
    );
  } else {
    return null;
  }
};

export default ContactSlice;
