// @flow
import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import cookie from 'cookie-cutter';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { london } from '@weco/common/utils/format-date';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '../Icon/Icon';

const OptInContainer = styled(Space).attrs(props => ({
  as: 'div',
  h: { size: 'l', properties: ['margin-bottom'] },
  className: font('hnl', 5),
}))`
  background: ${props => props.theme.colors.purple};
  color: ${props => props.theme.colors.white};
  position: relative;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 100%;
    border-bottom: 18px solid transparent;
    border-left: 16px solid ${props => props.theme.colors.purple};
  }
`;

const OptInControl = styled.button.attrs({
  className: classNames({
    'plain-button no-margin no-padding flex-inline flex--v-center ': true,
  }),
})`
  text-decoration: underline;
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  position: ${props => (props.optOut ? 'absolute' : 'static')};
  top: ${props => `${props.theme.spacingUnit}px`};
  right: ${props => `${props.theme.spacingUnit}px`};
  &:focus,
  &:hover {
    text-decoration: none;
  }
`;

const HiddenText = styled.span.attrs({
  className: 'visually-hidden',
})``;

type Props = {|
  text: {|
    defaultMessage: string[],
    optedInMessage: string[],
    optInCTA: string,
    optOutCTA: string,
  |},
  cookieName: string,
|};

const OptIn = ({ text, cookieName }: Props) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [cookieValue, setCookieValue] = useState(false);
  const { updateToggles } = useContext(TogglesContext);
  function optOut() {
    cookie.set(`toggle_${cookieName}`, 'false', {
      path: '/',
      expires: london()
        .add(1, 'year')
        .toDate(),
    });

    setShouldRender(false);
    updateToggles({
      [`${cookieName}`]: false,
    });
  }

  function optIn() {
    cookie.set(`toggle_${cookieName}`, 'true', {
      path: '/',
      expires: london()
        .add(1, 'year')
        .toDate(),
    });

    setCookieValue(true);
    updateToggles({
      [`${cookieName}`]: true,
    });
  }

  useEffect(() => {
    const cookieValue = cookie.get(`toggle_${cookieName}`);
    setCookieValue(cookieValue);
    setShouldRender(cookieValue === undefined || cookieValue === 'true');
  }, []);

  return (
    shouldRender && (
      <OptInContainer>
        <Space
          h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          v={{ size: 's', properties: ['padding-top', 'padding-bottom'] }}
        >
          {cookieValue
            ? text.optedInMessage.map((line, i) => (
                <p className="no-margin inline" key={i}>
                  {line}&nbsp;
                </p>
              ))
            : text.defaultMessage.map((line, i) => (
                <p className="no-margin" key={i}>
                  {line}
                </p>
              ))}
          {!cookieValue ? (
            <>
              <OptInControl
                onClick={() => {
                  optIn();
                }}
              >
                {text.optInCTA}
              </OptInControl>
              <OptInControl
                optOut
                onClick={() => {
                  optOut();
                }}
              >
                <Icon name="clear" extraClasses="icon--white" />
                <HiddenText>{text.optOutCTA}</HiddenText>
              </OptInControl>
            </>
          ) : (
            <OptInControl
              onClick={() => {
                optOut();
              }}
            >
              Opt out
            </OptInControl>
          )}
        </Space>
      </OptInContainer>
    )
  );
};

export default OptIn;
