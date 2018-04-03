import {grid, spacing, font} from '../../../utils/classnames';
import type {BackgroundTexture} from '../../../model/background-texture';

type Props = {|
  backgroundTexture: BackgroundTexture,
  title: string,
  description: string
|}

const FramedHeader = ({backgroundTexture, title, description}: Props) => (
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
      <div className='grid'>
        <div className={grid({s: 12, m: 10, l: 8, xl: 9})}>
          <h1 className={`${font({s: 'WB5', m: 'WB4', l: 'WB3'})} ${spacing({s: 3}, {margin: ['bottom']})} ${spacing({s: 0}, {margin: ['top']})}`}>{title}</h1>
        </div>
        <div className={grid({s: 12, m: 10, l: 8, xl: 9})} dangerouslySetInnerHTML={{__html: description}} />
      </div>
    </div>
  </div>
);

export default FramedHeader;
