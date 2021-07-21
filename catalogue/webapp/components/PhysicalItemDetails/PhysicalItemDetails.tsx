import { FunctionComponent } from 'react';
import styled from 'styled-components';
import ButtonInlineLink from '@weco/common/views/components/ButtonInlineLink/ButtonInlineLink';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';

const Wrapper = styled.div`
  border-bottom: 1px solid ${props => props.theme.color('pumice')};
  margin-bottom: 20px;
`;

const Row = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, min-content));
  grid-column-gap: 20px;
`;

const DetailHeading = styled.h3.attrs({
  className: classNames({
    [font('hnb', 5, { small: 3, medium: 3 })]: true,
    'no-margin': true,
  }),
})``;

const Box = styled(Space).attrs<{ isCentered?: boolean }>(props => ({
  v: {
    size: 's',
    properties: [props.isCentered ? undefined : 'margin-bottom'],
  },
}))<{ isCentered?: boolean }>`
  ${props =>
    props.isCentered &&
    `
    align-self: center;
  `}
`;
const Color = styled(Space).attrs({
  h: { size: 's', properties: ['margin-left'] },
})<{ color: string }>`
  width: 1em;
  height: 1em;
  display: inline-flex;
  background: ${props => props.color};
`;

export type Props = {
  title: string;
  itemNote?: string;
  locationAndShelfmark: string;
  accessMethod?: string;
  requestItemUrl?: string;
  accessNote?: string;
  color?: string;
};

const PhysicalItemDetails: FunctionComponent<Props> = ({
  title,
  itemNote,
  locationAndShelfmark,
  accessMethod,
  requestItemUrl,
  accessNote,
  color,
}) => {
  return (
    <Wrapper>
      <Row>
        <Box>
          <DetailHeading>{title}</DetailHeading>
          {itemNote && <span dangerouslySetInnerHTML={{ __html: itemNote }} />}
        </Box>
      </Row>
      <Row>
        <Box>
          <DetailHeading>Location</DetailHeading>
          <span>{locationAndShelfmark}</span>
          {color && <Color color={color} />}
        </Box>
        <Box>
          <DetailHeading>Access</DetailHeading>
          {accessMethod && <span>{accessMethod}</span>}
        </Box>
        <Box isCentered>
          {requestItemUrl && (
            <ButtonInlineLink text={'Request item'} link={requestItemUrl} />
          )}
        </Box>
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
