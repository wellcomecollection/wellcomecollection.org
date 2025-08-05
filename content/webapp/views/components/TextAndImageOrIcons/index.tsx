import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ImageType } from '@weco/common/model/image';
import { defaultSerializer } from '@weco/common/views/components/HTMLSerializers';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import CaptionedImage from '@weco/content/views/components/CaptionedImage';

const MediaAndTextWrap = styled(Space).attrs({
  $h: { size: 'l', properties: ['column-gap'] },
  $v: { size: 'l', properties: ['row-gap'] },
})`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;

  ${props => props.theme.media('medium')`
    flex-wrap: nowrap;
    flex-direction: row-reverse;
  `}
`;

const DividingLine = styled.div`
  border-top: 1px solid ${props => props.theme.color('neutral.400')};

  &:first-child {
    border: 0;
  }

  .slice-type-text-and-image + .slice-type-text-and-icons &,
  .slice-type-text-and-icons + .slice-type-text-and-image &,
  .slice-type-text-and-image + .slice-type-text-and-image &,
  .slice-type-text-and-icons + .slice-type-text-and-icons & {
    border-top: 1px solid ${props => props.theme.color('neutral.400')};
    ${props =>
      props.theme.makeSpacePropertyValues('l', ['margin-top', 'padding-top'])};
  }
`;

const ImageOrIcons = styled(Space).attrs({
  $h: { size: 'l', properties: ['column-gap'] },
  $v: { size: 'l', properties: ['row-gap'] },
})<{ $isIcons?: boolean; $isPortrait?: boolean }>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex: ${props =>
    props.$isIcons || props.$isPortrait ? '0 0 max(60%, 300px)' : '0 0 100%'};

  ${props =>
    props.theme.media('medium')(`
    flex: 1;
  `)}

  > * {
    flex: ${props => (props.$isIcons ? '0 0 25%' : undefined)};
    flex: ${props => (props.$isPortrait ? '0 0 85%' : undefined)};
  }
`;

const Text = styled.div.attrs({ className: 'spaced-text' })`
  flex-basis: 100%;

  ${props => props.theme.media('medium')`
    flex: 1;
  `}
`;

export type TextAndImageItem = {
  text: prismic.RichTextField;
  type: 'image';
  image: ImageType;
  isZoomable: boolean;
};

export type TextAndIconsItem = {
  text: prismic.RichTextField;
  type: 'icons';
  icons: ImageType[];
};

export type Props = {
  item: TextAndImageItem | TextAndIconsItem;
};

const TextAndImageOrIcons: FunctionComponent<Props> = ({ item }) => {
  // Icons can be added indefinitely without necessarily having an image, so we are filtering it here
  const icons: ImageType[] = [];
  if (item.type === 'icons') {
    icons.push(...item.icons.filter(icon => icon));
  }

  return (
    <DividingLine data-component="text-and-image-or-icons">
      <MediaAndTextWrap>
        {item.type === 'icons' && icons.length > 0 && (
          <ImageOrIcons $isIcons={true}>
            {/* We're enforcing a maximum of 6 icons within a slice  */}
            {icons.slice(0, 6).map((icon, index) => {
              return (
                <div key={index}>
                  <PrismicImage image={icon} quality="low" maxWidth={100} />
                </div>
              );
            })}
          </ImageOrIcons>
        )}
        {item.type === 'image' && item.image && (
          <ImageOrIcons $isPortrait={item.image.width < item.image.height}>
            <CaptionedImage
              image={item.image}
              caption={[]}
              hasRoundedCorners={false}
              isZoomable={item.isZoomable}
            />
          </ImageOrIcons>
        )}
        <Text>
          <PrismicHtmlBlock
            html={item.text}
            htmlSerializer={defaultSerializer}
          />
        </Text>
      </MediaAndTextWrap>
    </DividingLine>
  );
};

export default TextAndImageOrIcons;
