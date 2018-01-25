import {grid, spacing} from '../../common/utils/classnames';

export default ({children}) => (
  <div className={`row ${spacing({s: 3, m: 5, l: 10}, {padding: ['top']})}`}>
    <div className='container'>
      <div className='grid'>
        <div className={grid({s: 12, m: 10, shiftM: 1, l: 10, shiftL: 1, xl: 8, shiftXl: 1})}>
          <div className='body-content'>
            {children}
            <div className={spacing({s: 3, m: 5, l: 10}, {margin: ['top', 'bottom']})}>
              <hr className='divider divider--stub divider--black' />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
