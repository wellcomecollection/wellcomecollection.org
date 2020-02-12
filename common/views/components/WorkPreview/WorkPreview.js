// @flow
import styled from 'styled-components';

const WorkPreviewContainer = styled.div`
  img {
    width: auto;
    height: auto;
  }
`;
type Props = {|
  alt: string,
  imagePath: string,
|};

const WorkPreview = ({ imagePath, alt }: Props) => (
  <WorkPreviewContainer>
    <img alt={`view ${alt}`} src={imagePath} />
  </WorkPreviewContainer>
);

export default WorkPreview;
