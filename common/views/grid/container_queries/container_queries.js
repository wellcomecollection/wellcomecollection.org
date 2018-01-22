import {grid} from '../../../../common/utils/classnames';

export default () => (
  <div className='grid grid--justify-start'>
    <div className={grid({s: 3, m: 5, l: 3})}>
      <div className='grid-placeholder'></div>
    </div>
  </div>
);
