// @flow
import styled from 'styled-components';

const WorkPreviewContainer = styled.div`
  img {
    width: auto;
    height: auto;
  }
`;
type Props = {|
  imagePath: string,
|};

const WorkPreview = ({ imagePath }: Props) => (
  <WorkPreviewContainer>
    <img alt="" src={imagePath} />
  </WorkPreviewContainer>
);

export default WorkPreview;
