import {
  FunctionComponent,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';
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
  getEncoreLink,
  getFirstAccessCondition,
} from '@weco/common/utils/works';
import ConfirmItemRequest from '../ConfirmItemRequest/ConfirmItemRequest';
import StackingTable from '@weco/common/views/components/StackingTable/StackingTable';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import { itemIsRequestable } from '../../utils/requesting';
import Placeholder from '@weco/common/views/components/Placeholder/Placeholder';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';

const Wrapper = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom', 'padding-bottom'] },
})<{ underline: boolean }>`
  ${props =>
    props.underline &&
    `
    border-bottom: 1px solid ${props.theme.color('pumice')};
  `}
`;

type ButtonWrapperProps = {
  styleChangeWidth: number;
};

const ButtonWrapper = styled.div<ButtonWrapperProps>`
  // This transform is to align the request button
  // with the top of the other table headings
  & > button {
    transform: translateY(-1.2em);
  }

  @media (max-width: ${props => props.styleChangeWidth}px) {
    margin-top: ${props => props.theme.spacingUnit * 2}px;

    & > button {
      transform: translateY(0);
    }
  }
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
  accessDataIsStale: boolean;
  userHeldItems?: Set<string>;
  encoreLink?: string;
  isLast: boolean;
};

const PhysicalItemDetails: FunctionComponent<Props> = ({
  item,
  work,
  accessDataIsStale,
  userHeldItems,
  isLast,
}) => {
  const { state: userState } = useUser();
  const isArchive = useContext(IsArchiveContext);
  const { enableRequesting } = useContext(TogglesContext);
  const requestButtonRef = useRef<HTMLButtonElement | null>(null);

  const [requestModalIsActive, setRequestModalIsActive] = useState(false);

  // Immediately after a request is made, we can't see any evidence of it in either
  // the items API or the identity API... so, we completely fake the updated status.
  // This does mean that a refresh immediately after a request is made will show the
  // wrong state.
  //
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/7174
  const [requestWasCompleted, setRequestWasCompleted] = useState(false);

  const isHeldByUser =
    requestWasCompleted || (item.id && userHeldItems?.has(item.id));

  const physicalLocation = getFirstPhysicalLocation(item); // ok to assume items only have a single physicalLocation
  const accessCondition = getFirstAccessCondition(physicalLocation);

  const accessNote = accessCondition?.note;

  const locationLabel = physicalLocation && getLocationLabel(physicalLocation);

  const locationShelfmark =
    physicalLocation && getLocationShelfmark(physicalLocation);

  const isOpenShelves = physicalLocation?.locationType.id === 'open-shelves';

  const isRequestableOnline = accessCondition?.method?.id === 'online-request';
  const requestItemUrl = isRequestableOnline ? getEncoreLink(work) : undefined;

  const accessMethod = accessCondition?.method?.label || '';
  const accessStatus = (() => {
    if (requestWasCompleted) {
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
  const isRequestable = itemIsRequestable(item) && !requestWasCompleted;

  const showButton = enableRequesting
    ? isRequestable && userState === 'signedin'
    : !!requestItemUrl;

  const title = item.title || '';
  const itemNote = item.note || '';
  const location = locationLabel || '';
  const shelfmark = locationShelfmark || '';

  function createRows() {
    const requestButton = enableRequesting ? (
      <ButtonOutlined
        disabled={userState !== 'signedin'}
        ref={requestButtonRef}
        text={'Request item'}
        clickHandler={() => setRequestModalIsActive(true)}
      />
    ) : (
      requestItemUrl && (
        <ButtonOutlinedLink text={'Request item'} link={requestItemUrl} />
      )
    );

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

    const isLoading =
      accessDataIsStale ||
      (enableRequesting && isRequestable && userState === 'loading');
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
          {accessMethod}
        </Placeholder>
      );
    } else {
      dataRow.push(' ');
    }

    if (showButton) {
      dataRow.push(
        <ButtonWrapper styleChangeWidth={isArchive ? 980 : 620}>
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
      {enableRequesting && (
        <ConfirmItemRequest
          isActive={requestModalIsActive}
          setIsActive={setRequestModalIsActive}
          item={item}
          work={work}
          initialHoldNumber={userHeldItems?.size}
          onSuccess={() => setRequestWasCompleted(true)}
          openButtonRef={requestButtonRef}
        />
      )}
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
          columnWidths={[180, 200, null, null]}
        />
        {(accessNote || isHeldByUser) && (
          <Space v={{ size: 'm', properties: ['margin-top'] }}>
            <DetailHeading>Note</DetailHeading>
            <Placeholder
              nRows={3}
              // We don't know exactly what we'll render until we know whether the user holds this item
              isLoading={
                accessDataIsStale ||
                userState === 'loading' ||
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
