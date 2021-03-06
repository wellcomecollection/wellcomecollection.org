import { useEffect, useState, useRef, FunctionComponent } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import { getItemsByLocationType } from '@weco/common/utils/works';
import WorkDetailsSection from '../WorkDetailsSection/WorkDetailsSection';
import { DigitalLocation, Work } from '@weco/common/model/catalogue';
import styled from 'styled-components';

const ShowHideButton = styled.button.attrs({
  className: classNames({
    'plain-button no-margin no-padding': true,
    [font('hnr', 5)]: true,
  }),
})`
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`;
type Props = {
  work: Work;
};
const OnlineResources: FunctionComponent<Props> = ({ work }: Props) => {
  const onlineResources = getItemsByLocationType(work, 'online-resource').map(
    i => {
      const [location] = i.locations;
      return {
        title: i.title,
        location,
      };
    }
  ) as { title: string; location: DigitalLocation }[];

  const firstThreeOnlineResources = onlineResources.slice(0, 3);
  const remainingOnlineResources = onlineResources.slice(3);
  const [
    isShowingRemainingOnlineResources,
    setIsShowingRemainingOnlineResources,
  ] = useState(false);
  const firstOfRemainingOnlineResourcesRef = useRef<HTMLAnchorElement>(null);
  const showHideResourcesRef = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (isShowingRemainingOnlineResources) {
      firstOfRemainingOnlineResourcesRef?.current?.focus();
    } else {
      if (!firstRender.current) {
        showHideResourcesRef?.current?.focus();
      } else {
        firstRender.current = false;
      }
    }
  }, [isShowingRemainingOnlineResources]);

  return onlineResources.length > 0 ? (
    <WorkDetailsSection headingText="Online resources">
      <ul
        className={classNames({
          'plain-list no-margin no-padding': true,
        })}
      >
        {firstThreeOnlineResources.map(item => (
          <li
            className={classNames({
              [font('hnr', 5)]: true,
            })}
            key={item.location.url}
          >
            <a href={item.location.url}>
              {item.title
                ? `${item.title}: View resource`
                : item.location.linkText}
            </a>
          </li>
        ))}
        {isShowingRemainingOnlineResources && (
          <>
            {remainingOnlineResources.map((item, index) => (
              <li
                className={classNames({
                  [font('hnr', 5)]: true,
                })}
                key={item.location.url}
              >
                <a
                  href={item.location.url}
                  ref={
                    index === 0 ? firstOfRemainingOnlineResourcesRef : undefined
                  }
                >
                  {item.title
                    ? `${item.title}: View resource`
                    : item.location.linkText}
                </a>
              </li>
            ))}
          </>
        )}
      </ul>
      {remainingOnlineResources.length > 0 && (
        <ShowHideButton
          ref={showHideResourcesRef}
          onClick={() =>
            setIsShowingRemainingOnlineResources(
              !isShowingRemainingOnlineResources
            )
          }
        >
          {isShowingRemainingOnlineResources
            ? '- Show less'
            : `+ ${remainingOnlineResources.length} more`}
        </ShowHideButton>
      )}
    </WorkDetailsSection>
  ) : null;
};

export default OnlineResources;
