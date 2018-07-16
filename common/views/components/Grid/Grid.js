// @flow
import type {SizeMap} from '../../../utils/classnames';

type Props = {|
  children: React.Node[] | React.Node,
  sizes: SizeMap
|}

export function cssGrid(sizes: SizeMap): string {
  const base = 'css-grid__cell';
  const modifierClasses = Object.keys(sizes).map(key => {
    const size = sizes[key];
    const modifier = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `${base}--${modifier}${size}`;
  });

  return [base].concat(modifierClasses).join(' ');
}

const Grid = ({children, sizes}: Props) => (
  <div className='css-grid__container'>
    <div className='css-grid'>
      {Array.isArray(children) && children.map((child, i) =>
        <div className={cssGrid(sizes)} key={i}>
          {child}
        </div>
      )}
      {!Array.isArray(children) &&
        <div className={cssGrid(sizes)}>
          {children}
        </div>
      }
    </div>
  </div>
);

export default Grid;
