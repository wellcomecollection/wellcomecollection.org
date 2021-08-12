import { FunctionComponent, useContext, useState } from 'react';
import styled from 'styled-components';
import ButtonInlineLink from '@weco/common/views/components/ButtonInlineLink/ButtonInlineLink';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';
import IsArchiveContext from '@weco/common/views/components/IsArchiveContext/IsArchiveContext';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';
import {
  getLocationLabel,
  getLocationShelfmark,
  getFirstPhysicalLocation,
} from '@weco/common/utils/works';
import ConfirmItemRequest from '../ConfirmItemRequest/ConfirmItemRequest';

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
  item: PhysicalItem;
  work: Work;
  encoreLink?: string;
  isLast: boolean;
};

const PhysicalItemDetails: FunctionComponent<Props> = ({
  item,
  work,
  encoreLink,
  isLast,
}) => {
  const [isActive, setIsActive] = useState(false);
  const isArchive = useContext(IsArchiveContext);
  const { showItemRequestFlow } = useContext(TogglesContext);
  const physicalLocation = getFirstPhysicalLocation(item);
  const isOpenShelves = physicalLocation?.locationType.id === 'open-shelves';
  const isRequestableOnline =
    physicalLocation?.accessConditions?.[0]?.method?.id === 'online-request';
  const accessMethod =
    physicalLocation?.accessConditions?.[0]?.method?.label || '';
  const accessStatus =
    physicalLocation?.accessConditions?.[0]?.status?.label ||
    (isRequestableOnline ? 'Open' : '');
  const accessNote = physicalLocation?.accessConditions?.[0]?.note;
  const locationLabel = physicalLocation && getLocationLabel(physicalLocation);
  const locationShelfmark =
    physicalLocation && getLocationShelfmark(physicalLocation);

  const title = item.title || '';
  const itemNote = item.note || '';
  const location = locationLabel || '';
  const shelfmark = locationShelfmark || '';
  const requestItemUrl = isRequestableOnline ? encoreLink : undefined;

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
          {!isOpenShelves && (
            <>
              <Box>
                {accessStatus && (
                  <>
                    <DetailHeading>Access</DetailHeading>
                    <span>{accessStatus}</span>
                  </>
                )}
              </Box>
              <Box isCentered>
                {requestItemUrl ? (
                  <>
                    {showItemRequestFlow ? (
                      <ConfirmItemRequest
                        isActive={isActive}
                        setIsActive={setIsActive}
                        id={'test'}
                        item={item}
                        work={work}
                      />
                    ) : (
                      <ButtonInlineLink
                        text={'Request item'}
                        link={requestItemUrl}
                      />
                    )}
                  </>
                ) : (
                  <>{accessMethod}</>
                )}
              </Box>
            </>
          )}
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
