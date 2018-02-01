import Icon from '../Icon/Icon';

type Props = {|
  trackId: string
|}

const BackToTop = ({trackId}: Props) => (
  <a href='#top' className='back-to-top icon-rounder bg-transparent-black border-color-silver js-back-to-top flex flex--v-center flex--h-center'
    data-track-event={`{"category": "component", "action": "back-to-top:click", "label": "url: ${trackId}"}`}>
    <span className="back-to-top__text">back to top</span>
    <Icon name="chevron" extraClasses='icon--180 icon--white' />
  </a>
);

export default BackToTop;
