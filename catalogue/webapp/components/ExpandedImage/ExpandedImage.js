import type { NextLinkType } from '@weco/common/model/next-link-type';
import { font } from '@weco/common/utils/classnames';
import { getItemAtLocation } from '@weco/common/utils/works';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import Image from '@weco/common/views/components/Image/Image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getWork } from '../../services/catalogue/works';

type Props = {|
  title: string,
  id: string,
  workLink: NextLinkType,
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
  padding: 20px;
  
  ${({ index, theme }) => theme.media.small`
    width: calc(200% + ${theme.gutter.small}px);
    margin-left: ${getNegativeMargin(index, 2, theme.gutter.small)}
  `}
  ${({ index, theme }) => theme.media.medium`
    width: calc(300% + ${2 * theme.gutter.medium}px);
    margin-left: ${getNegativeMargin(index, 3, theme.gutter.medium)}
  `}
  ${({ index, theme }) => theme.media.large`
    width: calc(400% + ${3 * theme.gutter.large}px);
    margin-left: ${getNegativeMargin(index, 4, theme.gutter.large)}
  `}
  ${({ index, theme }) => theme.media.xlarge`
    width: calc(600% + ${5 * theme.gutter.xlarge}px);
    margin-left: ${getNegativeMargin(index, 6, theme.gutter.xlarge)}
  `}
`;

const ImageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.charcoal};
  min-width: 400px;
  min-height: 400px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .img {
    width: 400px;
  }
`;

const Content = styled.div`
  padding-left: 30px;
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

const ExpandedImage = ({ title, index, id, workLink }: Props) => {
  const [iiifUrl, setIiifUrl] = useState(null);
  const [description, setDescription] = useState('');
  useEffect(() => {
    const fetchWorkDetails = async () => {
      const detailedWork = await getWork({ id });
      const iiifImageLocation = getItemAtLocation(detailedWork, 'iiif-image');
      setIiifUrl(iiifImageLocation && iiifImageLocation.url);
      setDescription(detailedWork.description);
    };
    fetchWorkDetails();
  }, []);
  return (
    <Wrapper>
      <Indicator />
      <Box index={index}>
        <ImageWrapper>
          {iiifUrl && (
            <Image
              defaultSize={400}
              id={id}
              title={title}
              contentUrl={iiifUrl}
            />
          )}
        </ImageWrapper>
        <Content>
          <h2 className={font('hnm', 3)}>{title}</h2>
          <p>{description}</p>
          <Button
            type="secondary"
            text="Go to work"
            link={workLink}
            target="_blank"
          />
        </Content>
      </Box>
    </Wrapper>
  );
};

export default ExpandedImage;
