import Space from '@weco/common/views/components/styled/Space';
import { classNames } from '@weco/common/utils/classnames';

type Props = {
  title: 'string';
  body: JSX.Element;
  eventbriteId: string;
};

const CovidInfoBox = ({ title, body }) => {
  return (
    <Space
      h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
      className={classNames({
        'border-color-yellow': true,
      })}
      style={{ 'border-left-width': '10px', 'border-left-style': 'solid' }}
    >
      <h2 className="h2">{title}</h2>
      <div className="spaced-text body-text">{body}</div>
    </Space>
  );
};

export default CovidInfoBox;
