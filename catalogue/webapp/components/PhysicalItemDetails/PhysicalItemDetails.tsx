import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import ButtonInlineLink from '@weco/common/views/components/ButtonInlineLink/ButtonInlineLink';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';
import IsArchiveContext from '@weco/common/views/components/IsArchiveContext/IsArchiveContext';

const Row = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})``;

const Wrapper = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom', 'padding-bottom'] },
})<{ underline: boolean }>`
  ${props =>
    props.underline &&
    `
    border-bottom: 1px solid ${props.theme.color('pumice')};
  `}

  ${Row}:last-of-type {
    margin-bottom: 0;
  }
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

  ${props => props.theme.media.medium`
    margin-bottom: 0;
  `}
`;

const Grid = styled.div<{ isArchive: boolean }>`
  ${props => props.theme.media[props.isArchive ? 'large' : 'medium']`
    display: grid;
    grid-template-columns: 160px 130px 125px;
    grid-column-gap: 25px;
  `}
`;

export type Props = {
  title: string;
  itemNote?: string;
  location: string;
  shelfmark: string;
  accessMethod?: string;
  requestItemUrl?: string;
  accessNote?: string;
};

const PhysicalItemDetails: FunctionComponent<Props & { isLast: boolean }> = ({
  title,
  itemNote,
  location,
  shelfmark,
  accessMethod,
  requestItemUrl,
  accessNote,
  isLast,
}) => {
  const isArchive = useContext(IsArchiveContext);

  return (
    <Wrapper underline={!isLast}>
      {(title || itemNote) && (
        <Row>
          <Box>
            <DetailHeading>{title}</DetailHeading>
            {itemNote && (
              <span dangerouslySetInnerHTML={{ __html: itemNote }} />
            )}
          </Box>
        </Row>
      )}
      <Row>
        <Grid isArchive={isArchive}>
          <Box>
            <DetailHeading>Location</DetailHeading>
            <span className={`inline-block`}>{location}</span>{' '}
            <span className={`inline-block`}>{shelfmark}</span>
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
        </Grid>
      </Row>
      {accessNote && (
        <Row>
          <Box>
            <DetailHeading>Note</DetailHeading>
            <span dangerouslySetInnerHTML={{ __html: accessNote }} />
          </Box>
        </Row>
      )}
    </Wrapper>
  );
};

export default PhysicalItemDetails;
