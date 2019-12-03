// @flow
import type { SearchParams } from '@weco/common/services/catalogue/search-params';
import { itemUrl, workUrl } from '@weco/common/services/catalogue/urls';
import { font } from '@weco/common/utils/classnames';
import { getIIIFImageLicenceInfo } from '@weco/common/utils/iiif';
import { getItemAtLocation } from '@weco/common/utils/works';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import Image from '@weco/common/views/components/Image/Image';
import License from '@weco/common/views/components/License/License';
import { getWork } from '../../services/catalogue/works';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import RelatedImages from '../RelatedImages/RelatedImages';

type Props = {|
  title: string,
  id: string,
  searchParams: SearchParams,
  index: number,
|};

const getNegativeMargin = (index, rowWidth, gutter) => {
  const colIndex = index % rowWidth;
  return `calc(-${100 * colIndex}% - ${gutter * colIndex}px)`;
};

const Wrapper = styled.div`
  position: relative;
`;

const Box = styled.div`
  background-color: ${({ theme }) => theme.colors.pumice};
  display: flex;
  flex-direction: column;

  ${({ index, theme }) => theme.media.small`
    width: calc(200% + ${theme.gutter.small}px);
    padding:  ${theme.gutter.small}px;
    margin-bottom: ${theme.gutter.small}px;
    margin-left: ${getNegativeMargin(index, 2, theme.gutter.small)}
  `}
  ${({ index, theme }) => theme.media.medium`
    width: calc(300% + ${2 * theme.gutter.medium}px);
    padding:  ${theme.gutter.medium}px;
    margin-bottom: ${theme.gutter.medium}px;
    margin-left: ${getNegativeMargin(index, 3, theme.gutter.medium)}
  `}
  ${({ index, theme }) => theme.media.large`
    flex-direction: row;
    width: calc(400% + ${3 * theme.gutter.large}px);
    padding:  ${theme.gutter.large}px;
    margin-bottom: ${theme.gutter.large}px;
    margin-left: ${getNegativeMargin(index, 4, theme.gutter.large)}
  `}
  ${({ index, theme }) => theme.media.xlarge`
    width: calc(600% + ${5 * theme.gutter.xlarge}px);
    padding:  ${theme.gutter.xlarge}px;
    margin-bottom: ${theme.gutter.xlarge}px;
    margin-left: ${getNegativeMargin(index, 6, theme.gutter.xlarge)}
  `};
`;

const ImageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.charcoal};
  max-width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.media.large`
    min-width: 400px;
    max-width: 50%;
  `}
`;

const LicenseWrapper = styled.div`
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px 0 0 0;
  ${({ theme }) => theme.media.large`
    padding: 0 0 0 30px;
    max-width: 50%;
  `}
`;

const SpacedButton = styled(Button)`
  margin: 10px 10px 0 0;
`;

// The padding combined with the 2px border on a `secondary` button means
// that it appears larger than the `primary` button despite border-box being set.
// This styling - reducing the padding by the border width - makes the buttons the same size
const SpacedButtonBorderBox = styled(SpacedButton)`
  padding: ${({ theme: { spacingUnit } }) =>
    `${spacingUnit - 2}px ${4 * spacingUnit - 2}px`};
`;

const RelatedImagesWrapper = styled.div`
  display: flex;
  flex-grow: 10;
  flex-direction: column;
  justify-content: flex-end;
`;

const Indicator = styled.div`
  opacity: 1;
  display: block;
  height: 0;
  width: 0;
  position: absolute;
  top: -14px;
  left: calc(50% - 15px);
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 15px solid ${({ theme }) => theme.colors.pumice};
`;

const ExpandedImage = ({ title, index, id, searchParams }: Props) => {
  const [detailedWork, setDetailedWork] = useState(null);
  useEffect(() => {
    const fetchDetailedWork = async () => {
      const res = await getWork({ id });
      if (res.type === 'Work') {
        setDetailedWork(res);
      }
    };
    fetchDetailedWork();
  }, []);

  const iiifImageLocation =
    detailedWork && getItemAtLocation(detailedWork, 'iiif-image');
  const iiifImageLicenseInfo =
    iiifImageLocation && getIIIFImageLicenceInfo(iiifImageLocation);

  const workLink = workUrl({ ...searchParams, id });
  const itemLink =
    detailedWork &&
    itemUrl({
      ...searchParams,
      workId: id,
      canvas: 1,
      langCode: detailedWork.language && detailedWork.language.id,
      sierraId: null,
      isOverview: true,
      page: 1,
    });

  return (
    <Wrapper>
      <Indicator />
      <Box index={index}>
        <ImageWrapper>
          {iiifImageLocation && (
            <Image
              defaultSize={400}
              alt={title}
              contentUrl={iiifImageLocation.url}
              tasl={null}
            />
          )}
        </ImageWrapper>
        <Content>
          <h2 className={font('hnm', 3)}>{title}</h2>
          {iiifImageLicenseInfo && (
            <LicenseWrapper>
              <License subject="" licenseInfo={iiifImageLicenseInfo} />
            </LicenseWrapper>
          )}
          <p>{detailedWork && detailedWork.description}</p>
          <div>
            <SpacedButton type="primary" text="Go to work" link={workLink} />
            {itemLink && (
              <SpacedButtonBorderBox
                type="secondary"
                text="Go to image"
                link={itemLink}
              />
            )}
          </div>
          <RelatedImagesWrapper>
            <RelatedImages originalId={id} />
          </RelatedImagesWrapper>
        </Content>
      </Box>
    </Wrapper>
  );
};

export default ExpandedImage;
