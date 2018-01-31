import {withModifiers} from '../../../utils/classnames';

export default ({modifiers, extraClasses = ''}) => (
  <hr className={`${withModifiers('divider', modifiers)} ${extraClasses}`} />
);
