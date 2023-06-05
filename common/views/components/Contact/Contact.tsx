import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import { useToggles } from '@weco/common/server-data/Context';
import Space from '../styled/Space';
import ContactV2 from './Contact.V2';

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
  const { visualStories } = useToggles();

  if (visualStories)
    return (
      <ContactV2
        title={title}
        subtitle={subtitle}
        phone={phone}
        email={email}
      />
    );

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
