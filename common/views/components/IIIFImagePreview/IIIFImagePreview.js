// @flow
import type { NextLinkType } from '@weco/common/model/next-link-type';
import { iiifImageTemplate } from '../../../utils/convert-image-uri';
import { trackEvent } from '../../../utils/ga';
import styled from 'styled-components';
import NextLink from 'next/link';
import Image from '../Image/Image';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';

type Props = {|
  iiifUrl: string,
  width?: number,
  itemUrl: NextLinkType,
|};

const ImagePreview = styled.div`
  overflow: hidden;
  text-align: center;

  a {
    display: inline-block;
    cursor: zoom-in;
  }

  img {
    display: block;
    max-height: 400px;
    max-width: 100%;
    width: auto;
    position: relative;
    z-index: 1;
  }

  button {
    position: absolute;
    z-index: 3;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
  }
`;

const IIIFImagePreview = ({ iiifUrl, width = 1010, itemUrl }: Props) => {
  const imageContentUrl = iiifImageTemplate(iiifUrl)({ size: `${width},` });

  return (
    <ImagePreview>
      <NextLink {...itemUrl} passHref>
        <Space
          v={{
            size: 'xl',
            properties: ['padding-bottom'],
          }}
          as="a"
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
          />
          <Control type="dark" text="View larger image" icon="zoomIn" />
        </Space>
      </NextLink>
    </ImagePreview>
  );
};

export default IIIFImagePreview;
