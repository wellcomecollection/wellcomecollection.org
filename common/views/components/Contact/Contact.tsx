import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import { FunctionComponent, ReactElement } from 'react';

type Props = {
  title: string;
  subtitle: string | null;
  phone: string | null;
  email: string | null;
};

const Contact: FunctionComponent<Props> = ({
  title,
  subtitle,
  phone,
  email,
}: Props): ReactElement => {
  return (
    <Space
      h={{ size: 'm', properties: ['padding-left'] }}
      className={classNames({
        'border-color-turquoise border-left-width-5 body-text': true,
      })}
    >
      <span
        className={classNames({
          block: true,
        })}
      >
        <span
          className={classNames({
            [font('hnm', 4)]: true,
          })}
        >
          {title}
        </span>
        {subtitle && (
          <Space
            as="span"
            h={{ size: 's', properties: ['margin-left'] }}
            className={classNames({
              [font('hnl', 4)]: true,
            })}
          >
            {subtitle}
          </Space>
        )}
      </span>
      {phone && (
        <span
          className={classNames({
            [font('hnl', 4)]: true,
            block: true,
          })}
        >
          {phone}
        </span>
      )}
      {email && (
        <div>
          <a
            className={classNames({
              [font('hnl', 4)]: true,
            })}
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </div>
      )}
    </Space>
  );
};

export default Contact;
