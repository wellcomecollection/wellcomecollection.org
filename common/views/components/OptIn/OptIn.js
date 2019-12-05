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
  display: inline-block;
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

const cookieName = 'relevanceRating';

const OptIn = () => {
  const [shouldRender, setShouldRender]: [
    boolean,
    ((boolean => boolean) | boolean) => void
  ] = useState(false);
  const [optedIn, setOptedIn]: [
    boolean,
    ((boolean => boolean) | boolean) => void
  ] = useState(false);
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

    setOptedIn(true);
    updateToggles({
      [`${cookieName}`]: true,
    });
  }

  useEffect(() => {
    const cookieValue = cookie.get(`toggle_${cookieName}`);
    setOptedIn(Boolean(cookieValue));
    setShouldRender(cookieValue === undefined || cookieValue === 'true');
  }, []);

  return (
    shouldRender && (
      <OptInContainer>
        <Space
          h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          v={{ size: 's', properties: ['padding-top', 'padding-bottom'] }}
        >
          {optedIn ? (
            <p className="no-margin inline">Currently rating search results.</p>
          ) : (
            <>
              <p className="no-margin">Help us improve your search results.</p>
              <p className="no-margin">
                Rate your search results by how relevant they are to you.
              </p>
            </>
          )}{' '}
          {optedIn ? (
            <OptInControl
              onClick={() => {
                optOut();
              }}
            >
              Opt out
            </OptInControl>
          ) : (
            <>
              <OptInControl
                onClick={() => {
                  optIn();
                }}
              >
                Rate your results
              </OptInControl>
              <OptInControl
                optOut
                onClick={() => {
                  optOut();
                }}
              >
                <Icon name="clear" extraClasses="icon--white" />
                <HiddenText>No thanks</HiddenText>
              </OptInControl>
            </>
          )}
        </Space>
      </OptInContainer>
    )
  );
};

export default OptIn;
