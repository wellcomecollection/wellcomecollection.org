import Inferno from 'inferno';
import * as icons from './icons';

export default function Icon({ icon, title, modifiers = [] }) {
  return (
    <svg className={`icon ${modifiers.join(' ')}`} role={title && 'img'}>
      {title && <title>{title}</title>}
      {icons[icon]}
    </svg>
  );
}
