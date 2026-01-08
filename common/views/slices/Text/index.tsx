import * as prismic from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TextSlice as RawTextSlice } from '@weco/common/prismicio-types';
import { classNames } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import {
  defaultSerializer,
  dropCapSerializer,
  accessibilitySerializer,
} from '@weco/common/views/components/HTMLSerializers';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/views/components/Body';

export type TextProps = SliceComponentProps<RawTextSlice, SliceZoneContext>;

const Text: FunctionComponent<TextProps> = ({ slice, context }) => {
  const options = { ...defaultContext, ...context };
  const shouldBeDroppedCap =
    options.firstTextSliceIndex === slice.id && options.isDropCapped;

  // Check if this is the accessibility page
  const isAccessibilityPage =
    options.pageUid === 'accessibility' ||
    options.pageUid === 'prototype-a11y-november-2025';

  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <ConditionalWrapper
        condition={!!options.gridSizes}
        wrapper={children => (
          <ContaineredLayout gridSizes={options.gridSizes!}>
            {children}
          </ContaineredLayout>
        )}
      >
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
                htmlSerializer={
                  isAccessibilityPage
                    ? accessibilitySerializer
                    : defaultSerializer
                }
              />
            </>
          ) : (
            <PrismicHtmlBlock
              html={slice.primary.text}
              htmlSerializer={
                isAccessibilityPage
                  ? accessibilitySerializer
                  : defaultSerializer
              }
            />
          )}
        </div>
      </ConditionalWrapper>
    </SpacingComponent>
  );
};

export default Text;
