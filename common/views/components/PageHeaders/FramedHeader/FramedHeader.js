// @flow
import {spacing, grid} from '../../../../utils/classnames';
import type {BackgroundTexture} from '../../../../model/background-texture';

type Props = {|
  backgroundTexture: ?BackgroundTexture,
  children: React.Node
|}

// TODO: Add texture back
const FramedHeader = ({
  backgroundTexture,
  children
}: Props) => (
  <div className='framed-header row relative'>
    <div className='framed-header__image overflow-hidden bg-cream'>
      <div className='framed-header__wobbly-edge absolute'>
        <div className='wobbly-edge wobbly-edge--white js-wobbly-edge'
          data-is-valley='true'
          data-max-intensity='100'>
        </div>
      </div>
    </div>
    <div className={`relative container container--with-frame ${spacing({s: 5, m: 7}, {padding: ['top']})} ${spacing({s: 1}, {padding: ['bottom']})}`}>
      <div className='grid'>
        <div className={grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default FramedHeader;
