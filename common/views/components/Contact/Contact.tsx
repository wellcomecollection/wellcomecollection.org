import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { createScreenreaderLabel } from '../../../utils/telephone-numbers';

const Wrapper = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left'] },
  className: 'body-text',
})`
  border-left: 5px solid ${props => props.theme.color('accent.turquoise')};
`;

const TitleWrapper = styled.span`
  display: block;
`;

const Title = styled.span.attrs({ className: font('intb', 4) })``;

const Subtitle = styled(Space).attrs({
  as: 'span',
  h: { size: 's', properties: ['margin-left'] },
  className: font('intr', 4),
})``;

const PhoneNumber = styled.span.attrs({ className: font('intr', 4) })`
  display: block;
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
      <TitleWrapper>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleWrapper>
      {phone && (
        <>
          <span className="visually-hidden">
            {createScreenreaderLabel(phone)}
          </span>
          <PhoneNumber aria-hidden="true">{phone}</PhoneNumber>
        </>
      )}
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
