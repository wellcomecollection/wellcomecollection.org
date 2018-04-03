import {grid, spacing, font} from '../../../utils/classnames';

export const status = 'wip';
export const name = 'Framed Header';
export const preview = '@preview-no-container';
export const context = {
  children: (<div className='grid'>
    <div className={grid({s: 12, m: 10, l: 8, xl: 9})}>
      <h1 className={`${font({s: 'WB5', m: 'WB4', l: 'WB3'})} ${spacing({s: 3}, {margin: ['bottom']})} ${spacing({s: 0}, {margin: ['top']})}`}>Packed lunch</h1>
    </div>
    <div className={grid({s: 12, m: 10, l: 8, xl: 9})}>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nesciunt nisi omnis laborum, consequuntur adipisci tenetur blanditiis totam, at corporis molestiae ad esse ratione quasi deleniti temporibus, similique culpa ex?</p>
    </div>
  </div>)
};

export const variants = [
  {
    name: 'default',
    label: 'One',
    context: {
      backgroundTexture: {
        image: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F3f23f801-ec0e-45e6-a91a-ee9d21339ef8_wc+brand+backgrounds+2_pattern+1+colour+1.svg'
      }
    }
  },
  {
    name: 'two',
    context: {
      backgroundTexture: {
        image: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg'
      }
    }
  },
  {
    name: 'three',
    context: {
      backgroundTexture: {
        image: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F72c96062-9f4b-4a80-87e7-e6d5ad37bc42_wc+brand+backgrounds+2_pattern+3+colour+1.svg'
      }
    }
  },
  {
    name: 'four',
    context: {
      backgroundTexture: {
        image: 'https://prismic-io.s3.amazonaws.com/wellcomecollection%2Ffcafc624-72f8-4931-af19-99ea01967f55_wc+brand+backgrounds+2_pattern+4+colour+1.svg'
      }
    }
  },
  {
    name: 'five',
    context: {
      backgroundTexture: {
        image: 'https://prismic-io.s3.amazonaws.com/wellcomecollection%2F3b0ff272-1e2d-43c2-9375-3cad183bb01a_wc+brand+backgrounds+2_pattern+5+colour+1.svg'
      }
    }
  }
];
