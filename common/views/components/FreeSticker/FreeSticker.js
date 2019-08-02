// @flow
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';

const FreeSticker = () => (
  <Space
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
  </Space>
);

export default FreeSticker;
