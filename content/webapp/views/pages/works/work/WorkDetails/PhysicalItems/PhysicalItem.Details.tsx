import { FunctionComponent, ReactNode, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { sierraAccessMethodtoNewLabel } from '@weco/common/data/microcopy';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import StackingTable from '@weco/common/views/components/StackingTable';
import Space from '@weco/common/views/components/styled/Space';
import { useIsArchiveContext } from '@weco/content/contexts/IsArchiveContext';
import {
  PhysicalItem,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { itemIsRequestable } from '@weco/content/utils/requesting';
import {
  getFirstAccessCondition,
  getFirstPhysicalLocation,
  getLocationLabel,
  getLocationShelfmark,
} from '@weco/content/utils/works';

import ItemRequestModal from './ItemRequestModal';
import Placeholder from './PhysicalItem.Details.Placeholder';

const Wrapper = styled(Space).attrs({
  $v: { size: 'm', properties: ['margin-bottom', 'padding-bottom'] },
})<{ $underline: boolean }>`
  ${props =>
    props.$underline &&
    `
    border-bottom: 1px solid ${props.theme.color('warmNeutral.400')};
  `}
`;

type ButtonWrapperProps = {
  $styleChangeWidth: number;
};

const ButtonWrapper = styled.div<ButtonWrapperProps>`
  /* This transform is to align the request button
  with the top of the other table headings */
  & > button {
    transform: translateY(-1.2em);
  }

  @media (max-width: ${props => props.$styleChangeWidth}px) {
    margin-top: ${props => props.theme.spacingUnit * 2}px;

    & > button {
      transform: translateY(0);
    }
  }
`;

const DetailHeading = styled.h3.attrs({
  className: `${font('sans-bold', -1)}`,
})`
  margin-bottom: 0;
`;

export type Props = {
  item: PhysicalItem;
  work: Work;
  accessDataIsStale: boolean;
  userHeldItems?: Set<string>;
  isLast: boolean;
};

const PhysicalItemDetails: FunctionComponent<Props> = ({
  item,
  work,
  accessDataIsStale,
  userHeldItems,
  isLast,
}) => {
  const { state: userState } = useUserContext();
  const { disableRequesting } = useToggles();
  const isArchive = useIsArchiveContext();
  const theme = useTheme();
  const requestButtonRef = useRef<HTMLButtonElement | null>(null);
  const [requestModalIsActive, setRequestModalIsActive] = useState(false);

  // Immediately after a request is made, we can't see any evidence of it in either
  // the items API or the identity API... so, we completely fake the updated status.
  // This does mean that a refresh immediately after a request is made will show the
  // wrong state.
  //
  // Note: users can switch to a different work without reloading the page (e.g. using
  // an archive hierarchy), so we have to track the exact list of items they've just
  // requested -- it's not enough to know that _an_ item has been requested, we have
  // to know _which_ item has been requested.
  //
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/7174
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/8448
  //
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completedItemRequests, _] = useState<string[]>([]);

  function wasJustRequested(item: PhysicalItem): boolean {
    return item.id ? completedItemRequests.indexOf(item.id) !== -1 : false;
  }

  const isHeldByUser =
    wasJustRequested(item) || (item.id && userHeldItems?.has(item.id));

  const physicalLocation = getFirstPhysicalLocation(item); // ok to assume items only have a single physicalLocation

  const accessCondition = getFirstAccessCondition(physicalLocation);

  const accessNote = accessCondition?.note;

  const locationLabel = physicalLocation && getLocationLabel(physicalLocation);

  const locationShelfmark =
    physicalLocation && getLocationShelfmark(physicalLocation);

  const isOpenShelves = physicalLocation?.locationType.id === 'open-shelves';

  const accessMethod = accessCondition?.method?.label || '';
  const accessStatus = (() => {
    if (wasJustRequested(item)) {
      return 'Temporarily unavailable';
    } else if (isOpenShelves) {
      return 'Open shelves';
    } else {
      return accessCondition?.status?.label || '';
    }
  })();

  // Work out whether to show status, access and request button
  const showAccessStatus = !!accessStatus;
  const showAccessMethod = !isOpenShelves;
  const isRequestable = itemIsRequestable(item) && !wasJustRequested(item);
  const userNotLoaded = userState === 'loading' || userState === 'initial';

  const isLoading = accessDataIsStale || (isRequestable && userNotLoaded);
  const showButton =
    isRequestable &&
    userState === 'signedin' &&
    !disableRequesting &&
    !isLoading;

  const title = item.title || '';
  const itemNote = item.note || '';
  const location = locationLabel || '';
  const shelfmark = locationShelfmark || '';

  function createRows() {
    const headingRow = [
      'Location',
      showAccessStatus ? 'Status' : ' ',
      showAccessMethod ? 'Access' : ' ',
      ' ',
    ];

    const dataRow: ReactNode[] = [
      <>
        <div>{location}</div>
        <div>{shelfmark}</div>
      </>,
    ];

    if (showAccessStatus) {
      dataRow.push(
        <Placeholder isLoading={isLoading} nRows={2} maxWidth="75%">
          <span>{accessStatus}</span>
        </Placeholder>
      );
    } else {
      dataRow.push(' ');
    }

    if (showAccessMethod) {
      dataRow.push(
        <Placeholder isLoading={isLoading} nRows={2} maxWidth="75%">
          {sierraAccessMethodtoNewLabel[accessMethod] ?? accessMethod}
        </Placeholder>
      );
    } else {
      dataRow.push(' ');
    }

    if (showButton) {
      const requestButton = (
        <Button
          variant="ButtonSolid"
          colors={theme.buttonColors.greenTransparentGreen}
          disabled={userState !== 'signedin'}
          ref={requestButtonRef}
          text="Request item"
          dataGtmProps={{
            trigger: 'requesting_initiate',
          }}
          clickHandler={() => {
            setRequestModalIsActive(true);
          }}
        />
      );

      dataRow.push(
        <ButtonWrapper $styleChangeWidth={isArchive ? 980 : 620}>
          {requestButton}
        </ButtonWrapper>
      );
    } else {
      dataRow.push(' ');
    }

    return [headingRow, dataRow];
  }

  return (
    <>
      {/*
        There are pages with hundreds of items, e.g. https://wellcomecollection.org/works/h4t88h83

        There's a notable lag when we create instances of ItemRequestModal for
        all these items, so if we're never going to show the button, don't bother
        creating them.  This makes the page much snappier.
       */}
      {showButton && (
        <ItemRequestModal
          isActive={requestModalIsActive}
          setIsActive={setRequestModalIsActive}
          item={item}
          work={work}
          initialHoldNumber={userHeldItems?.size}
          onSuccess={() => item.id && completedItemRequests.push(item.id)}
          openButtonRef={requestButtonRef}
        />
      )}
      <Wrapper $underline={!isLast}>
        {(title || itemNote) && (
          <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
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
          columnWidths={[180, 200, undefined, undefined]}
        />

        {(accessNote || isHeldByUser) && (
          <Space $v={{ size: 'm', properties: ['margin-top'] }}>
            <DetailHeading>Note</DetailHeading>
            <Placeholder
              nRows={3}
              // We don't know exactly what we'll render until we know whether the user holds this item
              isLoading={
                accessDataIsStale ||
                userNotLoaded ||
                (userState === 'signedin' && !userHeldItems)
              }
              maxWidth="50%"
            >
              <span
                dangerouslySetInnerHTML={{
                  // if the user currently has this item on hold, we don't want
                  // to show the note that says another user has it
                  __html: isHeldByUser
                    ? 'You have requested this item.'
                    : accessNote || '', // This is always defined
                }}
              />
            </Placeholder>
          </Space>
        )}
      </Wrapper>
    </>
  );
};

export default PhysicalItemDetails;
