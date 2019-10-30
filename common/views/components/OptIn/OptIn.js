// @flow
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import cookie from 'cookie-cutter';
import { london } from '@weco/common/utils/format-date';
import { classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

const OptInContainer = styled(Space).attrs(props => ({
  as: 'div',
  h: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  v: { size: 'm', properties: ['padding-left', 'padding-right'] },
}))`
  max-width: 400px;
  background: ${props => props.theme.colors.purple};
  color: ${props => props.theme.colors.white};
  position: relative;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 100%;
    border-bottom: 20px solid transparent;
    border-left: 20px solid ${props => props.theme.colors.purple};
  }
`;

const OptInControl = styled.button.attrs({
  className: classNames({
    'plain-button no-margin no-padding': true,
  }),
})`
  color: ${props => props.theme.colors.white};
  cursor: pointer;
`;
type Props = {|
  text: {|
    defaultMessage: string,
    optedInMessage: string,
    optInCTA: 'opt in',
    optOutCTA: 'opt out',
  |},
  cookieName: string,
|};

const OptIn = ({ text, cookieName }: Props) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [cookieValue, setCookieValue] = useState(false);

  function optOut() {
    cookie.set(`${cookieName}`, 'false', {
      path: '/',
      expires: london()
        .add(1, 'year')
        .toDate(),
    });

    setShouldRender(false);
  }

  function optIn() {
    cookie.set(`${cookieName}`, 'true', {
      path: '/',
      expires: london()
        .add(1, 'year')
        .toDate(),
    });

    setCookieValue(true);
  }

  useEffect(() => {
    const cookieValue = cookie.get(`${cookieName}`);
    setCookieValue(cookieValue);
    setShouldRender(cookieValue === undefined || cookieValue === 'true');
  }, []);

  return (
    shouldRender && (
      <OptInContainer>
        {cookieValue ? text.optedInMessage : text.defaultMessage}
        <OptInControl
          onClick={() => {
            optIn();
          }}
        >
          {text.optInCTA}
        </OptInControl>
        <OptInControl
          onClick={() => {
            optOut();
          }}
        >
          {text.optOutCTA}
        </OptInControl>
      </OptInContainer>
    )
  );
};

export default OptIn;
