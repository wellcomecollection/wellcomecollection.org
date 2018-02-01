// @flow

import Icon from '../Icon/Icon';

type Props = {|
  elementId: string
|}

const ScrollToInfo = ({elementId}: Props) => (
  <a  href={`#${elementId}`}
    className="scroll-to-info js-scroll-to-info plain-link flex--v-center flex--h-center flex btn btn--round flush-container-right js-work-media-control pointer-events-all"
    data-track-event={`{"category": "component", "action": "scroll-to-info:click", "label": "scrolled-to-id:${elementId}"}`}>
    <Icon name='chevron' title='scroll to more information' extraClasses={['icon--white']} />
  </a>
);

export default ScrollToInfo;
