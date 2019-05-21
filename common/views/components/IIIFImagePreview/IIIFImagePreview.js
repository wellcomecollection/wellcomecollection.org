// @flow
import type { NextLinkType } from '@weco/common/model/next-link-type';
import { iiifImageTemplate } from '../../../utils/convert-image-uri';
import { trackEvent } from '../../../utils/ga';
import styled from 'styled-components';
import NextLink from 'next/link';
import Image from '../Image/Image';
import Control from '../Buttons/Control/Control';

type Props = {|
  id: string,
  title: string,
  iiifUrl: string,
  width?: number,
  itemUrl: NextLinkType,
|};

const ImagePreview = styled.div`
  overflow: hidden;
  text-align: center;

  img {
    width: auto;
  }
  a {
    display: inline-flex;
    align-items: flex-end;
    padding-bottom: ${props => `${props.theme.spacingUnit * 8}px`};
    cursor: zoom-in;
  }

  button {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
  }
`;

const IIIFImagePreview = ({
  id,
  title,
  iiifUrl,
  width = 1010,
  itemUrl,
}: Props) => {
  const imageContentUrl = iiifImageTemplate(iiifUrl)({ size: `${width},` });

  return (
    <ImagePreview>
      <NextLink {...itemUrl}>
        <a
          className="plain-link"
          onClick={() => {
            trackEvent({
              category: 'IIIFImagePreview',
              action: 'follow link',
              label: itemUrl.href.query.workId,
            });
          }}
        >
          <Image
            width={width}
            contentUrl={imageContentUrl}
            lazyload={true}
            sizesQueries="(min-width: 940px) 800px, (min-width: 600px) 88.75vw, calc(100vw - 36px)"
            alt=""
            defaultSize={1010}
            extraClasses="margin-h-auto width-auto full-height full-max-width block"
          />
          <Control type="dark" text="View larger image" icon="zoomIn" />
        </a>
      </NextLink>
    </ImagePreview>
  );
};

export default IIIFImagePreview;
