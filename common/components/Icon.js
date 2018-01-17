import * as icons from '../icons/index';

export default ({name, title, extraClasses = [], attrs = []}) => (
  <div
    className={['icon'].concat(extraClasses).join(' ')}
    aria-hidden={title && 'true'}>
    <canvas className='icon__canvas' height='26' width='26'></canvas>
    <svg className="icon__svg"
         {...title ? { role: 'img' } : { 'aria-hidden': true }}
         {...attrs}>
      {title && <title>{title}</title>}
      {icons[name]()}
    </svg>
  </div>
);
