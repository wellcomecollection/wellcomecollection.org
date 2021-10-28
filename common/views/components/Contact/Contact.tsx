import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import { FC, ReactElement } from 'react';
import styled from 'styled-components';

const Wrapper = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left'] },
  className: 'body-text',
})`
  border-left: 5px solid ${props => props.theme.color('turquoise')};
`;

type Props = {
  title: string;
  subtitle: string | null;
  phone: string | null;
  email: string | null;
};

const Contact: FC<Props> = ({
  title,
  subtitle,
  phone,
  email,
}: Props): ReactElement => {
  return (
    <Wrapper>
      <span
        className={classNames({
          block: true,
        })}
      >
        <span
          className={classNames({
            [font('hnb', 4)]: true,
          })}
        >
          {title}
        </span>
        {subtitle && (
          <Space
            as="span"
            h={{ size: 's', properties: ['margin-left'] }}
            className={classNames({
              [font('hnr', 4)]: true,
            })}
          >
            {subtitle}
          </Space>
        )}
      </span>
      {phone && (
        <span
          className={classNames({
            [font('hnr', 4)]: true,
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
              [font('hnr', 4)]: true,
            })}
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </div>
      )}
    </Wrapper>
  );
};

export default Contact;
