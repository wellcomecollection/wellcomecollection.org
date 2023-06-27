import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { ImageType } from '@weco/common/model/image';
import * as icons from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import CaptionedImage from '../CaptionedImage/CaptionedImage';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import * as prismic from '@prismicio/client';

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

const IconWrapper = styled.div`
  font-size: 100px;
  line-height: 0;
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
  .slice-type-text-and-icons + .slice-type-text-and-icons {
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
} & ({ type: 'icons'; icons: string[] } | { type: 'image'; image: ImageType });

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
                    <IconWrapper key={index}>
                      <Icon icon={icons[icon]} matchText={true} />
                    </IconWrapper>
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
                  isZoomable={true}
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
