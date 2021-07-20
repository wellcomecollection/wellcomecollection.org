import { FunctionComponent } from 'react';
import styled from 'styled-components';
import ButtonInlineLink from '@weco/common/views/components/ButtonInlineLink/ButtonInlineLink';

const Wrapper = styled.div`
  border-bottom: 1px solid ${props => props.theme.color('pumice')};
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 20px;
  margin-bottom: 10px;
`;

const Box = styled.div`
  padding-bottom: 10px;
`;
const Color = styled.span<{ color: string }>``;

export type Props = {
  title: string;
  itemNote?: string;
  locationAndShelfmark: string;
  accessMethod?: string;
  requestItemUrl?: string;
  accessNote?: string;
};

const PhysicalItemDetails: FunctionComponent<Props> = ({
  title,
  itemNote,
  locationAndShelfmark,
  accessMethod,
  requestItemUrl,
  accessNote,
}) => {
  return (
    <Wrapper>
      <Row>
        <Box>
          <h3>{title}</h3>
          {itemNote && <span dangerouslySetInnerHTML={{ __html: itemNote }} />}
        </Box>
      </Row>
      <Row>
        <Box>
          <h3>Location</h3>
          <span>{locationAndShelfmark}</span>
          <Color color={'red'} />
        </Box>
        <Box>
          <h3>Access</h3>
          {accessMethod && <span>{accessMethod}</span>}
        </Box>
        {requestItemUrl ? (
          <Box>
            <ButtonInlineLink text={'Request item'} link={requestItemUrl} />
          </Box>
        ) : (
          <Box></Box>
        )}
      </Row>
      {accessNote && (
        <Row>
          <Box>
            <span dangerouslySetInnerHTML={{ __html: accessNote }} />
          </Box>
        </Row>
      )}
    </Wrapper>
  );
};

export default PhysicalItemDetails;
