import { FunctionComponent } from 'react';
import * as icons from '../../../icons';

type Props = {
  name: string;
  title?: string;
  extraClasses?: string;
  attrs?: { [key: string]: [string] };
};

const Icon: FunctionComponent<Props> = ({
  name,
  title,
  extraClasses,
  attrs = {},
}: Props) => (
  <div
    className={`icon ${extraClasses || ''}`}
    aria-hidden={title ? true : undefined}
  >
    <svg
      className="icon__svg"
      {...(title
        ? { role: 'img', 'aria-labelledby': `icon-${name}-title` }
        : { 'aria-hidden': true })}
      {...attrs}
    >
      {title && <title id={`icon-${name}-title`}>{title}</title>}
      {icons[name]()}
    </svg>
  </div>
);

export default Icon;
