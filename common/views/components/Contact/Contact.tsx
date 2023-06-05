import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import { useToggles } from '@weco/common/server-data/Context';
import Space from '../styled/Space';

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

const WithIconWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 15px;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
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
  const { visualStories } = useToggles();
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
          {visualStories ? (
            <>
              <WithIconWrapper>
                <img
                  alt=""
                  style={{ width: '50px' }}
                  src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/12-v2-c-phone-icon.png"
                />
                <div>
                  <strong>By phone</strong>
                  <PhoneNumber aria-hidden="true">{phone}</PhoneNumber>
                </div>
              </WithIconWrapper>
            </>
          ) : (
            <PhoneNumber aria-hidden="true">{phone}</PhoneNumber>
          )}
        </>
      )}
      {email && (
        <div>
          {visualStories ? (
            <WithIconWrapper style={{}}>
              <img
                alt=""
                style={{ width: '50px' }}
                src="https://s3.eu-west-1.amazonaws.com/i.wellcomecollection.org/assets/images/visual-stories/12-v2-d-email-icon.png"
              />
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
          ) : (
            <a className={font('intr', 4)} href={`mailto:${email}`}>
              {email}
            </a>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default Contact;
