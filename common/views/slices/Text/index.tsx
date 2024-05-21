import * as prismic from '@prismicio/client';
import { TextSlice as SliceType } from '@weco/common/prismicio-types';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import {
  defaultSerializer,
  dropCapSerializer,
} from '@weco/content/components/HTMLSerializers/HTMLSerializers';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  LayoutWidth,
  defaultContext,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import { classNames } from '@weco/common/utils/classnames';

export type TextProps = SliceComponentProps<SliceType, SliceZoneContext>;

const Text: FunctionComponent<TextProps> = ({ slice, context, index }) => {
  const options = { ...defaultContext, ...context };
  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <LayoutWidth width={options.minWidth}>
        <div
          className={classNames({
            'body-text spaced-text': true,
            'first-text-slice': options.firstTextSliceIndex === index,
          })}
        >
          {options.firstTextSliceIndex === index && options.isDropCapped ? (
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
