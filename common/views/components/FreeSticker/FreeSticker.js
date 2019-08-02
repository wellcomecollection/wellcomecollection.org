// @flow
import { font, classNames } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

const FreeSticker = () => (
  <VerticalSpace
    v={{
      size: 's',
      properties: ['padding-top', 'padding-bottom'],
    }}
    as="span"
    className={classNames({
      'font-white bg-black rotate-r-8 absolute': true,
      [font('wb', 5)]: true,
      'padding-left-12 padding-right-12': true,
    })}
    style={{ marginTop: '-20px', right: '0' }}
  >
    Free
  </VerticalSpace>
);

export default FreeSticker;
