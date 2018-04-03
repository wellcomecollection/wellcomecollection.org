import {grid, spacing, font} from '../../../../utils/classnames';

export const status = 'wip';
export const name = 'Framed';
export const preview = '@preview-no-container';
export const context = {
  backgroundTexture: {
    image: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F3f23f801-ec0e-45e6-a91a-ee9d21339ef8_wc+brand+backgrounds+2_pattern+1+colour+1.svg'
  },
  children: (<div className='grid'>
    <div className={grid({s: 12, m: 10, l: 8, xl: 9})}>
      <h1 className={`${font({s: 'WB5', m: 'WB4', l: 'WB3'})} ${spacing({s: 3}, {margin: ['bottom']})} ${spacing({s: 0}, {margin: ['top']})}`}>Packed lunch</h1>
    </div>
    <div className={grid({s: 12, m: 10, l: 8, xl: 9})}>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nesciunt nisi omnis laborum, consequuntur adipisci tenetur blanditiis totam, at corporis molestiae ad esse ratione quasi deleniti temporibus, similique culpa ex?</p>
    </div>
  </div>)
};
