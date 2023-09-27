import {
  useEffect,
  useState,
  useRef,
  FunctionComponent,
  ReactElement,
} from 'react';
import { font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import PlainList from '@weco/common/views/components/styled/PlainList';

const ShowHideButton = styled.button.attrs({
  className: font('intr', 5),
})`
  margin: 0 !important;
  padding: 0;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`;

type Props = {
  listItems: (string | ReactElement)[];
  initialItems?: number;
};
const ExpandableList: FunctionComponent<Props> = ({
  listItems,
  initialItems = 3,
}: Props) => {
  const firstListItems = listItems.slice(0, initialItems);
  const remainingListItems = listItems.slice(initialItems);
  const [isShowingRemainingListItems, setIsShowingRemainingListItems] =
    useState(false);
  const firstOfRemainingListItemRef = useRef<HTMLAnchorElement>(null);
  const showHideItemsRef = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (isShowingRemainingListItems) {
      firstOfRemainingListItemRef?.current?.focus();
    } else {
      if (!firstRender.current) {
        showHideItemsRef?.current?.focus();
      } else {
        firstRender.current = false;
      }
    }
  }, [isShowingRemainingListItems]);

  return listItems.length > 0 ? (
    <>
      <PlainList>
        {firstListItems.map(
          (
            item,
            index // TODO way of getting better key?
          ) => (
            <li className={font('intr', 5)} key={index}>
              {item}
            </li>
          )
        )}
        {isShowingRemainingListItems && (
          <>
            {remainingListItems.map((item, index) => (
              <li className={font('intr', 5)} key={index}>
                {/* if item is a link then add href and index 0 */}
                {item}
              </li>
            ))}
          </>
        )}
      </PlainList>
      {remainingListItems.length > 0 && (
        <ShowHideButton
          ref={showHideItemsRef}
          onClick={() =>
            setIsShowingRemainingListItems(!isShowingRemainingListItems)
          }
        >
          {isShowingRemainingListItems
            ? '- Show less'
            : `+ ${remainingListItems.length} more`}
        </ShowHideButton>
      )}
    </>
  ) : null;
};

export default ExpandableList;
