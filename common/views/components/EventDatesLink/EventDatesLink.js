// @flow

import NextLink from 'next/link';
import {font, classNames} from '../../../utils/classnames';
import {trackEventV2} from '../../../utils/ga';
import Icon from '../Icon/Icon';

const EventDatesLink = () => {
  return (
    <NextLink
      href={`#dates`}
      as={`#dates`}>
      <a
        onClick={() => {
          trackEventV2({
            eventCategory: 'EventDatesLink',
            eventAction: 'follow link',
            eventLabel: 'n/a'
          });
        }}
        className={classNames({
          'flex-inline': true,
          'flex-v-center': true,
          [font({s: 'HNM5', m: 'HNM4'})]: true
        })}>
        <Icon name={`arrowSmall`} extraClasses='icon--black icon--90' />
        <span>{`See all dates`}</span>
      </a>
    </NextLink>
  );
};

export default EventDatesLink;
