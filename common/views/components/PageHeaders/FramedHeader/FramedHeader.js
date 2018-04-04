import {spacing} from '../../../../utils/classnames';
import type {BackgroundTexture} from '../../../../model/background-texture';

type Props = {|
  backgroundTexture: BackgroundTexture,
  children: React.node
|}

const FramedHeader = ({backgroundTexture, children}: Props) => (
  <div className='framed-header row relative'>
    <div className='framed-header__image overflow-hidden bg-turquoise'
      style={backgroundTexture.image && {backgroundImage: `url(${backgroundTexture.image})`}}>
      <div className='framed-header__wobbly-edge absolute'>
        <div className='wobbly-edge wobbly-edge--white js-wobbly-edge'
          data-is-valley='true'
          data-max-intensity='100'>
        </div>
      </div>
    </div>
    <div className={`relative container container--with-frame bg-white ${spacing({s: 5, m: 7}, {padding: ['top']})} ${spacing({s: 1}, {padding: ['bottom']})}`}>
      {children}
    </div>
  </div>
);

export default FramedHeader;
