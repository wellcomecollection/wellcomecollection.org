import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useToggles } from '@weco/common/server-data/Context';
import Space from '@weco/common/views/components/styled/Space';

const IframePdfViewer = styled(Space)`
  width: 100%;
  height: 90vh;
  display: block;
  border: 0;
  margin-left: auto;
  margin-right: auto;
`;

const PdfLink = styled.a`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 280px;
  min-height: 100px;
  border: 1px solid ${props => props.theme.color('neutral.400')};
  text-decoration: none;
  transition: background-color 0.2s ease;
  padding: 1rem 2rem;

  &:hover {
    background-color: ${props => props.theme.color('neutral.200')};
  }
`;

const IIIFItemPdf = ({ src, label }: { src: string; label?: string }) => {
  const { isMobileOrTablet } = useAppContext();
  const { extendedViewer } = useToggles();
  const title = label || 'PDF';
  return (
    <>
      {isMobileOrTablet && extendedViewer ? (
        <PdfLink href={src} target="_blank" rel="noopener noreferrer">
          {title}
        </PdfLink>
      ) : (
        <IframePdfViewer as="iframe" title={title} src={src} />
      )}
    </>
  );
};

export default IIIFItemPdf;
