import { FunctionComponent, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
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
import { useUserInfo } from '@weco/identity/src/frontend/MyAccount/UserInfoContext';
import { withPrefix } from '@weco/identity/src/frontend/MyAccount/UserInfoContext/UserInfoContext';
import {
  unrequestableStatusIds,
  unrequestableMethodIds,
} from '../WorkDetails/WorkDetails';

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

type UserHolds = {
  results: { item: { id: string } }[];
};

const PhysicalItemDetails: FunctionComponent<Props> = ({
  item,
  work,
  encoreLink,
  isLast,
}) => {
  const { user, isLoading } = useUserInfo();
  const [isActive, setIsActive] = useState(false);
  const isArchive = useContext(IsArchiveContext);
  const { enableRequesting } = useContext(TogglesContext);
  const physicalLocation = getFirstPhysicalLocation(item);
  const isOpenShelves = physicalLocation?.locationType.id === 'open-shelves';
  const isRequestableOnline =
    physicalLocation?.accessConditions?.[0]?.method?.id === 'online-request';
  const accessMethod =
    physicalLocation?.accessConditions?.[0]?.method?.label || '';
  const accessMethodId =
    physicalLocation?.accessConditions?.[0]?.method?.id || '';
  const accessStatusId =
    physicalLocation?.accessConditions?.[0]?.status?.id || '';
  const accessStatus =
    physicalLocation?.accessConditions?.[0]?.status?.label ||
    (isRequestableOnline ? 'Open' : '');
  const accessNote = physicalLocation?.accessConditions?.[0]?.note;
  const locationLabel = physicalLocation && getLocationLabel(physicalLocation);
  const locationShelfmark =
    physicalLocation && getLocationShelfmark(physicalLocation);
  const hideButton =
    unrequestableStatusIds.some(i => i === accessStatusId) ||
    unrequestableMethodIds.some(i => i === accessMethodId);
  const [userHolds, setUserHolds] = useState<UserHolds | undefined>();

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    fetch(withPrefix(`/api/users/${user.userId}/item-requests`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (!response.ok) return;

      if (isMounted) {
        response.json().then(setUserHolds);
      }
    });

    return () => {
      // We can't cancel promises, so using the isMounted value to prevent the component from trying to update the state if it's been unmounted.
      isMounted = false;
    };
  }, []);

  const title = item.title || '';
  const itemNote = item.note || '';
  const location = locationLabel || '';
  const shelfmark = locationShelfmark || '';
  const requestItemUrl = isRequestableOnline ? encoreLink : undefined;
  const isHeldByUser = userHolds
    ? userHolds.results.some(r => r.item.id === item.id)
    : false;

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
                {hideButton ? (
                  // TODO: fairly sure displaying this `accessMethod` here isn't what we want
                  // (at least not all the time) but it is useful to see e.g. 'Not requestable'
                  isHeldByUser ? (
                    <span>You have this item on hold</span>
                  ) : (
                    <>{accessMethod}</>
                  )
                ) : (
                  <>
                    {enableRequesting ? (
                      <>
                        {user && !isLoading && (
                          <ConfirmItemRequest
                            isActive={isActive}
                            setIsActive={setIsActive}
                            item={item}
                            work={work}
                            user={user}
                            initialHoldNumber={userHolds?.results.length ?? 0}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {requestItemUrl && (
                          <ButtonOutlinedLink
                            text={'Request item'}
                            link={requestItemUrl}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </Box>
            </>
          )}
        </Grid>
      </Row>
      {accessNote &&
        !isHeldByUser && ( // if the user currently has this item on hold, we don't want to show the note that says another user has it
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
