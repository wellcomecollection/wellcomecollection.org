import * as prismic from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import {
  defaultSerializer,
  dropCapSerializer,
} from '@weco/content/components/HTMLSerializers/HTMLSerializers';
import SpacingComponent from '../../components/styled/SpacingComponent';
import { LayoutWidth } from '@weco/content/components/Body/Body';
import { classNames, font } from '@weco/common/utils/classnames';

export type TextProps = SliceComponentProps<{
  type: string;
  value: prismic.RichTextField;
}>;

const Text = ({ slice, context, index }: TextProps): JSX.Element => {
  return (
    <SpacingComponent $sliceType={slice.type}>
      <LayoutWidth width={context.minWidth}>
        <div
          className={classNames({
            'body-text spaced-text': true,
            'first-text-slice': context.firstTextSliceIndex === index,
          })}
        >
          {context.firstTextSliceIndex === index ? (
            <>
              <PrismicHtmlBlock
                html={[slice.value[0]] as prismic.RichTextField}
                htmlSerializer={dropCapSerializer}
              />
              <PrismicHtmlBlock
                html={slice.value.slice(1) as prismic.RichTextField}
                htmlSerializer={defaultSerializer}
              />
            </>
          ) : (
            <PrismicHtmlBlock
              html={slice.value}
              htmlSerializer={defaultSerializer}
            />
          )}
        </div>
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default Text;
