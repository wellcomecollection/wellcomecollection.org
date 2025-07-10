import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ContactSlice as RawContactSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformContactSlice } from '@weco/content/services/prismic/transformers/body';
import {
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
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
        <LayoutWidth width={context.minWidth}>
          <Contact {...transformedSlice.value} />
        </LayoutWidth>
      </SpacingComponent>
    );
  } else {
    return null;
  }
};

export default ContactSlice;
