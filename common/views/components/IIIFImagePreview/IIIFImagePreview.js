// @flow
import { iiifImageTemplate } from '../../../utils/convert-image-uri';
import styled from 'styled-components';
import NextLink from 'next/link';
import Image from '../Image/Image';

type Props = {|
  id: string,
  title: string,
  iiifUrl: string,
  width?: number,
  itemUrl: any,
|};

const PreviewContainer = styled.div`
  min-height: 200px;
  height: calc(100vh - 160px);
  text-align: center;
  padding: ${props =>
    `${props.theme.spacingUnit * 4}px 0 ${props.theme.spacingUnit * 6}px`};
`;

const IIIFImagePreview = ({
  id,
  title,
  iiifUrl,
  width = 800,
  itemUrl,
}: Props) => {
  const imageContentUrl = iiifImageTemplate(iiifUrl)({ size: `${width},` });
  return (
    <PreviewContainer>
      <NextLink {...itemUrl}>
        <a
          className="plain-link"
          onClick={() => {
            // trackEvent({
            //   category: 'IIIFPresentationPreview', // TODO make consistent with previous image tracking...
            //   action: 'follow link',
            //   label: itemUrl.href.query.workId,
            // });
          }}
        >
          <Image
            width={width}
            contentUrl={imageContentUrl}
            lazyload={false}
            sizesQueries="(min-width: 860px) 800px, calc(92.59vw + 22px)"
            alt=""
            defaultSize={800}
            extraClasses="margin-h-auto width-auto full-height full-max-width block"
          />
        </a>
      </NextLink>
    </PreviewContainer>
  );
};

export default IIIFImagePreview;
