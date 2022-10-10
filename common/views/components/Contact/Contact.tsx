import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

const Wrapper = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left'] },
  className: 'body-text',
})`
  border-left: 5px solid ${props => props.theme.color('accent.turquoise')};
`;

export type Props = {
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
    <Wrapper>
      <span className="block">
        <span className={font('intb', 4)}>{title}</span>
        {subtitle && (
          <Space
            as="span"
            h={{ size: 's', properties: ['margin-left'] }}
            className={font('intr', 4)}
          >
            {subtitle}
          </Space>
        )}
      </span>
      {phone && <span className={`${font('intr', 4)} block`}>{phone}</span>}
      {email && (
        <div>
          <a className={font('intr', 4)} href={`mailto:${email}`}>
            {email}
          </a>
        </div>
      )}
    </Wrapper>
  );
};

export default Contact;
