import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import Space from '../styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import { phone as phoneIcon, email as emailIcon } from '@weco/common/icons';

const Wrapper = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left'] },
  className: 'body-text',
})`
  border-left: 5px solid ${props => props.theme.color('accent.turquoise')};
`;

const TitleWrapper = styled.span`
  display: block;
  margin-bottom: 15px;

  ${props => props.theme.media('medium')`
    margin-bottom: 30px;
  `}
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

const WithIconWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 10px;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }

  .icon {
    margin-top: 5px;
    width: 25px;
    height: 25px;
  }

  ${props => props.theme.media('medium')`
    gap: 15px;

    .icon {
      width: 35px;
      height: 35px;
    }
  `}
`;

export type Props = {
  title: string;
  subtitle: string | null;
  phone: string | null;
  email: string | null;
};

const ContactV2: FunctionComponent<Props> = ({
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
          <>
            <WithIconWrapper>
              <Icon icon={phoneIcon} />
              <div>
                <strong>By phone</strong>
                <PhoneNumber aria-hidden="true">{phone}</PhoneNumber>
              </div>
            </WithIconWrapper>
          </>
        </>
      )}

      {email && (
        <div>
          <WithIconWrapper>
            <Icon icon={emailIcon} />
            <div>
              <span>
                {phone ? 'Or ' : ''}
                <strong>by email</strong>
              </span>
              <a
                style={{ display: 'block' }}
                className={font('intr', 4)}
                href={`mailto:${email}`}
              >
                {email}
              </a>
            </div>
          </WithIconWrapper>
        </div>
      )}
    </Wrapper>
  );
};

export default ContactV2;
