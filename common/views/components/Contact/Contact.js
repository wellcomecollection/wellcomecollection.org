// @flow

import { font, classNames } from '../../../utils/classnames';

type Props = {|
  title: string,
  subtitle: ?string,
  phone: ?string,
  email: ?string,
|};

function Contact({ title, subtitle, phone, email }: Props) {
  return (
    <div
      className={classNames({
        'padding-left-12': true,
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
          <span
            className={classNames({
              [font('hnl', 4)]: true,
              'margin-left-6': true,
            })}
          >
            {subtitle}
          </span>
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
    </div>
  );
}

export default Contact;
