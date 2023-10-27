import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import { phone as phoneIcon, email as emailIcon } from '@weco/common/icons';

const Wrapper = styled(Space).attrs({
  className: 'body-text',
  $h: { size: 'm', properties: ['padding-left'] },
})`
  border-left: 5px solid ${props => props.theme.color('accent.turquoise')};
`;

const TitleWrapper = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  display: block;
`;

const Title = styled.span.attrs({ className: font('intb', 4) })``;

const Subtitle = styled(Space).attrs({
  as: 'span',
  className: font('intr', 4),
  $h: { size: 's', properties: ['margin-left'] },
})``;

const PhoneNumber = styled.span.attrs({ className: font('intr', 4) })`
  display: block;
`;

const WithIconWrapper = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
  $h: { size: 's', properties: ['column-gap'] },
})`
  display: flex;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }

  .icon {
    margin-top: 5px;
    width: 25px;
    height: 25px;

    ${props => props.theme.media('medium')`
        width: 35px;
        height: 35px;
    `}
  }
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
        <WithIconWrapper>
          <Icon icon={phoneIcon} />
          <div>
            <span className="visually-hidden">
              {createScreenreaderLabel(phone)}
            </span>
            <PhoneNumber aria-hidden="true">{phone}</PhoneNumber>
          </div>
        </WithIconWrapper>
      )}

      {email && (
        <WithIconWrapper>
          <Icon icon={emailIcon} />
          <a
            style={{ display: 'block' }}
            className={font('intr', 4)}
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </WithIconWrapper>
      )}
    </Wrapper>
  );
};

export default Contact;
