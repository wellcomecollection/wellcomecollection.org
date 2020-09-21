// @flow
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';

const FreeSticker = () => (
  <Space
    v={{
      size: 's',
      properties: ['padding-top', 'padding-bottom'],
    }}
    h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
    as="span"
    className={classNames({
      'font-white bg-black rotate-r-8 absolute': true,
      [font('wb', 5)]: true,
    })}
    style={{ marginTop: '-20px', right: '0', zIndex: '1' }}
  >
    Free
  </Space>
);

export default FreeSticker;
