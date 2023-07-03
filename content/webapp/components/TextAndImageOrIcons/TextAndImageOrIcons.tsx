import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { ImageType } from '@weco/common/model/image';
import CaptionedImage from '../CaptionedImage/CaptionedImage';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import * as prismic from '@prismicio/client';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';

const MediaAndTextWrap = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;

  ${props => props.theme.media('medium')`
    flex-wrap: nowrap;
    flex-direction: row-reverse;
  `}
`;

const DividingLine = styled(Space).attrs({
  v: { size: 'l', properties: ['margin-top', 'padding-top'] },
})`
  border-top: 1px solid ${props => props.theme.color('neutral.400')};

  &:first-child {
    border: 0;
  }

  .slice-type-text-and-image + .slice-type-text-and-icons &,
  .slice-type-text-and-icons + .slice-type-text-and-image &,
  .slice-type-text-and-image + .slice-type-text-and-image &,
  .slice-type-text-and-icons + .slice-type-text-and-icons & {
    border-top: 1px solid ${props => props.theme.color('neutral.400')};
  }
`;

const ImageOrIcons = styled.div<{ isIcons?: boolean; isPortrait?: boolean }>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  flex: 0 0
    ${props => (props.isIcons || props.isPortrait ? 'max(60%, 300px)' : '100%')};

  ${props =>
    props.theme.media('medium')(`
    flex: 1;
  `)}

  > * {
    flex: ${props => (props.isIcons ? '0 0 30%' : undefined)};
    flex: ${props => (props.isPortrait ? '0 0 85%' : undefined)};
  }
`;

const Text = styled.div`
  flex-basis: 100%;

  ${props => props.theme.media('medium')`
    flex: 1;
  `}
`;

type Item = {
  text: prismic.RichTextField;
} & (
  | { type: 'icons'; icons: ImageType[] }
  | { type: 'image'; image: ImageType; isZoomable: boolean }
);

type Props = {
  items: Item[];
};

const TextAndImageOrIcons: FunctionComponent<Props> = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <DividingLine key={index}>
          <MediaAndTextWrap>
            {item.type === 'icons' && (
              <ImageOrIcons isIcons={true}>
                {item.icons.map((icon, index) => {
                  return (
                    <div key={index}>
                      <PrismicImage image={icon} quality="low" maxWidth={100} />
                    </div>
                  );
                })}
              </ImageOrIcons>
            )}

            {item.type === 'image' && (
              <ImageOrIcons isPortrait={item.image.width < item.image.height}>
                <CaptionedImage
                  image={item.image}
                  caption={[]}
                  hasRoundedCorners={false}
                  isZoomable={item.isZoomable}
                />
              </ImageOrIcons>
            )}

            <Text>
              <PrismicHtmlBlock html={item.text} />
            </Text>
          </MediaAndTextWrap>
        </DividingLine>
      ))}
    </>
  );
};

export default TextAndImageOrIcons;
