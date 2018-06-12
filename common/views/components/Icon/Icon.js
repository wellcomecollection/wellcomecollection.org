// @flow

import * as icons from '../../../icons/index';

type Props = {|
  name: string,
  title?: string,
  extraClasses?: string,
  attrs?: {| [string]: [string] |}
|}

const Icon = ({name, title, extraClasses, attrs = {}}: Props) => (
  <div
    className={`icon ${extraClasses || ''}`}
    aria-hidden={title && 'true'}>
    <canvas className='icon__canvas' height='26' width='26'></canvas>
    <svg className='icon__svg'
      {...title ? { role: 'img', 'aria-labelledby': `icon-${name}-title` } : { 'aria-hidden': true }}
      {...attrs}>
      {title && <title id={`icon-${name}-title`}>{title}</title>}
      {icons[name]()}
    </svg>
  </div>
);

export default Icon;
