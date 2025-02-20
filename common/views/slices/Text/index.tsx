import * as prismic from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TextSlice as RawTextSlice } from '@weco/common/prismicio-types';
import { classNames } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import {
  defaultSerializer,
  dropCapSerializer,
} from '@weco/content/components/HTMLSerializers/HTMLSerializers';

export type TextProps = SliceComponentProps<RawTextSlice, SliceZoneContext>;

const Text: FunctionComponent<TextProps> = ({ slice, context }) => {
  const options = { ...defaultContext, ...context };
  const shouldBeDroppedCap =
    options.firstTextSliceIndex === slice.id && options.isDropCapped;

  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <LayoutWidth width={options.minWidth}>
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
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default Text;
