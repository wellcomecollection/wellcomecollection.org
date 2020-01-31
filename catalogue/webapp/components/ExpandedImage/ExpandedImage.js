// @flow
import type { SearchParams } from '@weco/common/services/catalogue/search-params';
import { itemUrl, workUrl } from '@weco/common/services/catalogue/urls';
import { getIIIFImageLicenceInfo } from '@weco/common/utils/iiif';
import { getLocationOfType } from '@weco/common/utils/works';
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

const Modal = styled.div`
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translateX(-50%) translateY(-50%);
  position: fixed;
  background: white;
  padding: 20px;
  height: 80vh;
  width: 80vw;
  max-width: 1200px;
  overflow: auto;
`;

const ExpandedImage = ({ title, id, searchParams }: Props) => {
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
    detailedWork && getLocationOfType(detailedWork, 'iiif-image');
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
      page: 1,
    });

  return (
    <Modal>
      {iiifImageLocation && (
        <Image
          defaultSize={400}
          alt={title}
          contentUrl={iiifImageLocation.url}
          tasl={null}
        />
      )}
      <div>
        <h2 className="h2">{title}</h2>
        {iiifImageLicenseInfo && (
          <div>
            <License subject="" licenseInfo={iiifImageLicenseInfo} />
          </div>
        )}
        <p>{detailedWork && detailedWork.description}</p>
        <div>
          <Button type="primary" text="View image" link={itemLink} />
          {itemLink && (
            <Button type="secondary" text="About this work" link={workLink} />
          )}
        </div>
        <div>
          <RelatedImages originalId={id} />
        </div>
      </div>
    </Modal>
  );
};

export default ExpandedImage;
