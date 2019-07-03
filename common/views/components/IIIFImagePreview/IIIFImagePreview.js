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

  a {
    display: inline-block;
    padding-bottom: ${props => `${props.theme.spacingUnit * 8}px`};
    cursor: zoom-in;
  }

  img {
    display: block;
    max-height: 400px;
    max-width: 100%;
    width: auto;
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
            sizesQueries="(min-width: 1420px) 1218px, (min-width: 600px) 87.75vw, calc(100vw - 36px)"
            alt=""
            defaultSize={180}
            tasl={null}
          />
          <Control type="dark" text="View larger image" icon="zoomIn" />
        </a>
      </NextLink>
    </ImagePreview>
  );
};

export default IIIFImagePreview;
