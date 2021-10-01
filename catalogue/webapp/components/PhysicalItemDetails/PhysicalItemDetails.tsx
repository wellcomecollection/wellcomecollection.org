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
import { useUserInfo } from '@weco/common/views/components/UserInfoContext';
import {
  unrequestableStatusIds,
  unrequestableMethodIds,
} from '../WorkDetails/WorkDetails';
import StackingTable from '@weco/common/views/components/StackingTable/StackingTable';

const Wrapper = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom', 'padding-bottom'] },
})<{ underline: boolean }>`
  ${props =>
    props.underline &&
    `
    border-bottom: 1px solid ${props.theme.color('pumice')};
  `}
`;

const DetailHeading = styled.h3.attrs({
  className: classNames({
    [font('hnb', 5, { small: 3, medium: 3 })]: true,
    'no-margin': true,
  }),
})``;

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
  const isArchive = useContext(IsArchiveContext);
  const { enableRequesting } = useContext(TogglesContext);
  const [isActive, setIsActive] = useState(false);
  const [userHolds, setUserHolds] = useState<UserHolds | undefined>();

  const physicalLocation = getFirstPhysicalLocation(item); // ok to assume items only have a single physicalLocation

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

  const requestItemUrl = isRequestableOnline ? encoreLink : undefined;

  // Work out whether to show the requestButton
  const accessMethodId =
    physicalLocation?.accessConditions?.[0]?.method?.id || '';

  const accessStatusId =
    physicalLocation?.accessConditions?.[0]?.status?.id || '';

  // Work out whether to show status and access and request button
  // TODO tidy up logic about showing button, encorporate isRequestableOnline, encoreUrl
  const showStatus = isOpenShelves || accessStatus;
  const showAccess = !isOpenShelves;
  const hideRequestButton =
    unrequestableStatusIds.some(i => i === accessStatusId) ||
    unrequestableMethodIds.some(i => i === accessMethodId) ||
    (!user && enableRequesting);
  const showButton =
    (enableRequesting && !hideRequestButton) ||
    (!enableRequesting && requestItemUrl);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    fetch(`/account/api/users/${user.userId}/item-requests`, {
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
  }, [user?.userId]);

  const title = item.title || '';

  const itemNote = item.note || '';

  const location = locationLabel || '';
  const shelfmark = locationShelfmark || '';

  const isHeldByUser = userHolds
    ? userHolds.results.some(r => r.item.id === item.id)
    : false;

  // TODO cater for when isHeldByUser updates
  function createRows() {
    const requestButton =
      enableRequesting && !hideRequestButton ? (
        <>
          {isHeldByUser ? (
            <span>You have this item on hold</span>
          ) : (
            <ConfirmItemRequest
              isActive={isActive}
              setIsActive={setIsActive}
              item={item}
              work={work}
              user={isLoading ? undefined : user}
              initialHoldNumber={userHolds?.results.length ?? 0}
            />
          )}
        </>
      ) : (
        requestItemUrl &&
        !hideRequestButton && (
          <ButtonOutlinedLink text={'Request item'} link={requestItemUrl} />
        )
      );

    const headingRow = [
      'Location',
      showStatus && 'Status',
      showAccess && 'Access',
      showButton && '',
    ].filter(Boolean);

    const dataRow = [
      <>
        <div>{location}</div>
        <div>{shelfmark}</div>
      </>,
      showStatus && (
        <span>
          {isOpenShelves && 'Open shelves'}
          {!isOpenShelves && accessStatus}
        </span>
      ),
      showAccess && accessMethod,
      showButton && requestButton,
    ].filter(Boolean);

    return [headingRow, dataRow];
  }

  return (
    <>
      <Wrapper underline={!isLast}>
        {(title || itemNote) && (
          <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
            <DetailHeading>{title}</DetailHeading>
            {itemNote && (
              <span dangerouslySetInnerHTML={{ __html: itemNote }} />
            )}
          </Space>
        )}
        <StackingTable
          rows={createRows()}
          plain={true}
          maxWidth={isArchive ? 980 : 620}
        />
        {accessNote &&
          !isHeldByUser && ( // if the user currently has this item on hold, we don't want to show the note that says another user has it
            <Space v={{ size: 'm', properties: ['margin-top'] }}>
              <DetailHeading>Note</DetailHeading>
              <span dangerouslySetInnerHTML={{ __html: accessNote }} />
            </Space>
          )}
      </Wrapper>
    </>
  );
};

export default PhysicalItemDetails;
