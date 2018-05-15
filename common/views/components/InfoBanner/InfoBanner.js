// @flow

import {spacing, grid, font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';

type Props = {|
  cookieName?: string,
  text: string
|}

const InfoBanner = ({cookieName, text}: Props) => (
  <div
    className={`row bg-yellow is-hidden js-info-banner ${spacing({s: 3}, {padding: ['top', 'bottom']})}`}
    data-cookie-name={cookieName}>
    <div className='container'>
      <div className='grid'>
        <div className={grid({s: 12, m: 12, l: 12, xl: 12})}>
          <div className={`flex flex--v-center flex--h-space-between ${font({s: 'HNL5', m: 'HNL4'})}`}>
            <div>
              <span className='flex flex--v-center'>
                <div className={`flex flex--v-center ${spacing({s: 2}, {margin: ['right']})}`}>
                  <Icon name='information' />
                </div>
                <div className='first-para-no-margin' dangerouslySetInnerHTML={{ __html: text }} />
              </span>
            </div>
            {cookieName && <div>
              <button className='no-margin no-padding plain-button pointer js-info-banner-close'>
                <Icon name='cross' title='Close notification' />
              </button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default InfoBanner;
