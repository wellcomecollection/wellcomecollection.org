import * as prismic from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TextSlice as RawTextSlice } from '@weco/common/prismicio-types';
import { classNames } from '@weco/common/utils/classnames';
import { dasherize } from '@weco/common/utils/grammar';
import {
  defaultSerializer,
  dropCapSerializer,
} from '@weco/common/views/components/HTMLSerializers';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/views/components/Body';

export type TextProps = SliceComponentProps<RawTextSlice, SliceZoneContext>;

const Text: FunctionComponent<TextProps> = ({ slice, context }) => {
  const options = { ...defaultContext, ...context };
  const shouldBeDroppedCap =
    options.firstTextSliceIndex === slice.id && options.isDropCapped;

  // Find the first heading2 to use as the section ID
  let sectionId = slice.id;
  if (options.stickyNavA11y) {
    try {
      const heading2 = slice.primary.text.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.type === 'heading2' && item.text
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (heading2 && (heading2 as any).text) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sectionId = dasherize((heading2 as any).text);
      }
    } catch {
      // Fall back to slice.id if there's any error
    }
  }

  const content = (
    <div
      className={classNames({
        'body-text spaced-text': true,
        'first-text-slice': options.firstTextSliceIndex === slice.id,
      })}
    >
      {shouldBeDroppedCap ? (
        <>
          <PrismicHtmlBlock
            html={[slice.primary.text[0]] as prismic.RichTextField}
            htmlSerializer={dropCapSerializer}
          />
          <PrismicHtmlBlock
            html={slice.primary.text.slice(1) as prismic.RichTextField}
            htmlSerializer={defaultSerializer}
          />
        </>
      ) : (
        <PrismicHtmlBlock
          html={slice.primary.text}
          htmlSerializer={defaultSerializer}
        />
      )}
    </div>
  );

  return (
    <SpacingComponent
      $sliceType={slice.slice_type}
      $sliceId={options.stickyNavA11y ? sectionId : undefined}
      $useSectionElement={options.stickyNavA11y}
    >
      {options.isInGridCell && options.stickyNavA11y ? (
        content
      ) : (
        <LayoutWidth width={options.minWidth}>{content}</LayoutWidth>
      )}
    </SpacingComponent>
  );
};

export default Text;
