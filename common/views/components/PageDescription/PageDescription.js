// @flow

import {grid, font, spacing, withModifiers} from '../../../utils/classnames';
import {formatDate} from '../../../utils/format-date';
import Icon from '../Icon/Icon';

type Props = {|
  lead?: boolean,
  title: string,
  meta?: {|
    type: string,
    value: string
  |},
  intro?: string,
  icon?: string,
  modifiers?: Array<string>
|};

function renderMeta({type, value}) {
  return type === 'date'
    ? [<Icon key="1" name='clock' extraClasses={['margin-right-s1']} />, <span key="2">{formatDate(value)}</span>]
    : [value];
}

const PageDescription = ({lead, title, meta, intro, icon, modifiers}: Props) => (
  <header className={withModifiers('page-description', modifiers)}>
    <div className={`row page-description__row ${lead && 'row--lead row--lead--l'}`}>
      <div className='container page-description__container'>
        <div className='grid'>
          <div className={`
            ${grid({s: 12, m: 10, shiftM: 1})}
            ${lead
              ? grid({l: 11, shiftL: 1, xl: 10, shiftXl: 1})
              : grid({l: 12, xl: 11})
            }`}>
            {intro &&
              <span className={`
              page-description__intro
              ${font({s: 'WB7', m: 'WB6', l: 'WB5'})}
              ${spacing({s: 1, l: 2}, {margin: ['bottom']})}
            `}>{intro}</span>
            }
            <h1 className={`${font({s: 'WB5', m: 'WB4', l: 'WB3'})} page-description__title`}>
              {icon && <Icon name={icon} />}
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
    {meta &&
      <div className='row'>
        <div className='container'>
          <div className='grid'>
            <div className={`
              ${grid({shiftM: 1})}
              ${lead && grid({shiftL: 1, shiftXl: 1})}
            `}>
              <span className={`page-description__subtext ${font({s: 'HNL5'})}`}>
                {renderMeta(meta)}
              </span>
            </div>
          </div>
        </div>
      </div>
    }
  </header>
);

export default PageDescription;
