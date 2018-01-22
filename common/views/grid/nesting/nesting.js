import {grid} from '../../../../common/utils/classnames';

export default () => (
  <div className='grid'>
    <div className={grid({s: 12, m: 6, l: 4})}>
      <div className='grid-placeholder'></div>
    </div>
    <div className='grid__cell'>
      <div className='grid'>
        <div className={grid({m: 12})}>
          <div className='grid-placeholder'></div>
        </div>
        <div className={grid({m: 12})}>
          <div className='grid-placeholder'></div>
        </div>
      </div>
    </div>
  </div>
);
