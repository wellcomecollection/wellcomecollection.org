// @flow

import { spacing, font, classNames } from '../../../utils/classnames';

type Props = {|
  title: string,
  phone: ?string,
  email: ?string,
|};

function Contact({ title, phone, email }: Props) {
  return (
    <div
      className={classNames({
        [spacing({ s: 2 }, { padding: ['left'] })]: true,
        'border-color-turquoise border-left-width-5 body-text': true,
      })}
    >
      <span
        className={classNames({
          [font({ s: 'HNM3' })]: true,
          block: true,
        })}
      >
        {title}
      </span>
      {phone && (
        <span
          className={classNames({
            [font({ s: 'HNL3' })]: true,
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
              [font({ s: 'HNL3' })]: true,
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
