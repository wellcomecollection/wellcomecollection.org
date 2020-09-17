import Space from '@weco/common/views/components/styled/Space';
import { classNames } from '@weco/common/utils/classnames';
import EventbriteButton from '@weco/common/views/components/EventbriteButton/EventbriteButton';

type Props = {
  title: 'string';
  body: JSX.Element;
  eventbriteId: string;
};

const CovidInfoBox = ({ title, body, eventbriteId }) => {
  return (
    <Space
      v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
      h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
      className={classNames({
        'border-color-yellow border-width-2': true,
      })}
    >
      <h2 className="h2">{title}</h2>
      <div className="spaced-text body-text">
        {body}
        <EventbriteButton event={{ eventbriteId }} />
      </div>
    </Space>
  );
};

export default CovidInfoBox;
