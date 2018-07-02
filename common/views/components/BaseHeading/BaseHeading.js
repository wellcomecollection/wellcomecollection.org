import {spacing} from '../../../utils/classnames';

type Props = {|
  hasWhiteBg: boolean,
  text: string
|}

const BaseHeading = ({hasWhiteBg, text}: Props) => (
  <h1 className={`
    h1 no-margin
    ${hasWhiteBg ? '' : `
      bg-white
      ${spacing({ s: 2 }, { padding: ['left', 'right'] })}
      ${spacing({ s: 1 }, { padding: ['bottom', 'top'] })}
    `}
  `}>
    <span className='base-heading__inner'>
      {text}
    </span>
  </h1>
);

export default BaseHeading;
