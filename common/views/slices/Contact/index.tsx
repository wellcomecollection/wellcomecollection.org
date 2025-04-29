import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ContactSlice as RawContactSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body';
import Contact from '@weco/content/components/Contact';
import { transformContactSlice } from '@weco/content/services/prismic/transformers/body';

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
