import {spacing} from '../../../utils/classnames';

type Props = {|
  hasWhiteBackground: boolean,
  text: string
|}

const BaseHeading = ({hasWhiteBackground, text}: Props) => {
  const spanClass = hasWhiteBackground
    ? `
      box-decoration-break-clone
      bg-white
      ${spacing({s: 2}, {padding: ['left', 'right']})}
      ${spacing({s: 1}, {padding: ['bottom', 'top']})}
    `
    : '';

  return (
    <h1 className='h1'>
      <span className={spanClass}>
        {text}
      </span>
    </h1>
  );
};

export default BaseHeading;
