// @flow
import type {Installation as InstallationType} from '../../../services/prismic/installation';
import {grid, font, spacing} from '../../../utils/classnames';

const Installation = (installation: InstallationType) => (
  <div>
    <header className='page-description'>
      <div className='row page-description__row'>
        <div className='container page-description__container'>
          <div className='grid'>
            <div className={`${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
              <h1 className={`page-description__title ${font({s: 'WB5', m: 'WB4', l: 'WB3'})}`}>
                {installation.title}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div className={`row bg-cream ${spacing({s: 3}, {padding: ['top']})} ${spacing({s: 8}, {padding: ['bottom']})}`}>
      <div className='container'>
        <div className='grid'>
          <div className={`basic-page ${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
            {/* component 'basic-body', {pageBody: page.bodyParts, contentType: page.contentType} */}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Installation;
