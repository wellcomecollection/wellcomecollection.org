import {grid} from '../../../../common/utils/classnames';

export default () => (
  <div className='grid'>
    <div className={grid({s: 6, m: 3, l: 4})}>
      <div className='grid-placeholder'></div>
    </div>
    <div className='grid__cell'>
      <div className='grid-placeholder'></div>
    </div>
  </div>
);
