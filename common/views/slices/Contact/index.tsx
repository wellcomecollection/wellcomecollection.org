import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ContactSlice as RawContactSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformContactSlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import Contact from '@weco/content/views/components/Contact';

export type ContactProps = SliceComponentProps<
  RawContactSlice,
  SliceZoneContext
>;

const ContactSlice: FunctionComponent<ContactProps> = ({ slice, context }) => {
  const options = { ...defaultContext, ...context };
  const transformedSlice = transformContactSlice(slice);
  if (transformedSlice) {
    const content = <Contact {...transformedSlice.value} />;

    return (
      <SpacingComponent
        $sliceType={transformedSlice.type}
        $sliceId={options.stickyNavA11y ? slice.id : undefined}
        $useSectionElement={options.stickyNavA11y}
      >
        {options.isInGridCell && options.stickyNavA11y ? (
          content
        ) : (
          <LayoutWidth width={context.minWidth}>{content}</LayoutWidth>
        )}
      </SpacingComponent>
    );
  } else {
    return null;
  }
};

export default ContactSlice;
