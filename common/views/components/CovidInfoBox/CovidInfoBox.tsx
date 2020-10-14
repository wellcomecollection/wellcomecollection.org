import Space from '@weco/common/views/components/styled/Space';
import { classNames } from '@weco/common/utils/classnames';

type Props = {
  id: string;
  title: string;
  children: JSX.Element;
  eventbriteId: string;
};

const CovidInfoBox = ({ title, id, children }) => {
  return (
    <Space
      h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
      className={classNames({
        'border-color-yellow': true,
      })}
      style={{ borderLeftWidth: '10px', borderLeftStyle: 'solid' }}
    >
      <h2 className="h2" id={id}>
        {title}
      </h2>
      <div className="spaced-text body-text">{children}</div>
    </Space>
  );
};

export default CovidInfoBox;
