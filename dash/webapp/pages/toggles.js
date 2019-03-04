// @flow
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import getCookies from 'next-cookies';
import Header from '../components/Header';
const fontFamily = 'Gadget, sans-serif';

const Button = styled.button`
  border: ${props => (props.opaque ? 'none' : '2px solid #007868')};
  color: ${props => (props.opaque ? 'black' : '#007868')};
  display: inline-block;
  border-radius: 2px;
  padding: 6px 10px;
  transition: background 150ms ease;
  cursor: pointer;
  margin-right: 18px;
`;

const aYear = 31536000;
function setCookie(name, value, domain = 'wellcomecollection.org') {
  const expiration = value
    ? ` Max-Age=${aYear}`
    : `Expires=${new Date('1970-01-01').toString()}`;
  document.cookie = `toggle_${name}=${value ||
    ''}; Path=/; Domain=${domain}; ${expiration}`;
}

const abTests = [
  {
    id: 'genericWorkCard',
    title: 'Generic work card',
    description:
      'Visual treatment of the work card that accounts for other work types ' +
      'and not exclusively images',
  },
];

const featureToggles = [
  {
    id: 'showCatalogueSearchFilters',
    title: 'Catalogue search filters',
    description:
      'We currently filter the results of the catalogue to show Pictures and ' +
      'Digital images work types, and only results with images.' +
      'This will show unfilter those results, and allow for filtering.',
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: 'Asking people for feedback on our service',
  },
  {
    id: 'showWorkLocations',
    title: 'Show the locations of a work in the header',
    description:
      'These can be either physical or digital locations. We need to do a little bt of work figuring out what all the codes mean to get the messaging right.',
  },
  {
    id: 'showWorkPreview',
    title: 'Work preview',
    description:
      'Shows a simple preview of a digitised work, as part of the work details section of the work page. Currently focussing on images and digitised books. By default this is a single image.',
  },
  {
    id: 'showMultiImageWorkPreview',
    title: 'Work preview with multiple images',
    description:
      'This toggle should be used in conjunction with the showWorkPreview toggle. Where a work has multiple images, we can try showing more of them.',
  },
  {
    id: 'betaBar',
    title: 'Beta bar',
    description:
      'Letting people know that the service is being worked on, how they might ' +
      "find out about what's going on, and let us know what they think.",
  },
];

const IndexPage = () => {
  const [toggles, setToggles] = useState({});
  const [domain, setDomain] = useState('wellcomecollection.org');
  const [showDomainSetter, setShowDomainSetter] = useState(false);

  // We use this over getInitialProps as it's ineffectual when an app is
  // exported.
  useEffect(() => {
    setDomain(
      window.location.hostname.match('wellcomecollection.org')
        ? 'wellcomecollection.org'
        : window.location.pathname
    );

    const cookies = getCookies({});
    const initialToggles = Object.keys(cookies).reduce((acc, key) => {
      if (key.startsWith('toggle_')) {
        acc[key.replace('toggle_', '')] = cookies[key] === 'true';
      }
      return acc;
    }, {});
    setToggles(initialToggles);
  }, []);

  return (
    <div
      style={{
        fontFamily,
      }}
    >
      <Header title={'Toggles'} />
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          <h2 style={{ flexGrow: 1 }}>Feature toggles</h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showDomainSetter && (
              <input
                type="text"
                value={domain}
                onChange={event => setDomain(event.currentTarget.value)}
              />
            )}
            {!showDomainSetter && (
              <button
                type="button"
                onClick={event => setShowDomainSetter(!showDomainSetter)}
              >
                Set domain
              </button>
            )}
          </div>
        </div>
        <p
          style={{
            border: '1px solid rgba(92,184,191,1)',
            background: 'rgba(92,184,191,0.25)',
            padding: '6px 12px',
            margin: 0,
          }}
        >
          You can opt-in to testing a new feature (👍) or, prefer to stay
          opted-out (👎). If you ask us to forget your choice, it is effectually
          opting out.
        </p>
        {featureToggles.length > 0 && (
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {featureToggles.map(toggle => (
              <li
                key={toggle.id}
                style={{
                  marginTop: '18px',
                  borderTop: '1px solid #d9d6ce',
                  paddingTop: '6px',
                }}
              >
                <h3 style={{ marginRight: '6px' }}>{toggle.title}</h3>
                <p>{toggle.description}</p>
                <Button
                  onClick={() => {
                    setCookie(toggle.id, 'true', domain);
                    // $FlowFixMe
                    setToggles({
                      ...toggles,
                      [toggle.id]: true,
                    });
                  }}
                  style={{
                    opacity: toggles[toggle.id] === true ? 1 : 0.5,
                  }}
                >
                  👍 Count me in
                </Button>
                <Button
                  onClick={() => {
                    setCookie(toggle.id, 'false', domain);
                    // $FlowFixMe
                    setToggles({
                      ...toggles,
                      [toggle.id]: false,
                    });
                  }}
                  style={{
                    opacity: toggles[toggle.id] === false ? 1 : 0.5,
                  }}
                >
                  👎 No thanks
                </Button>
                <Button
                  onClick={() => {
                    setCookie(toggle.id, null, domain);
                    delete toggles[toggle.id];
                    setToggles(toggles);
                  }}
                  opaque
                >
                  Forget my choice
                </Button>
              </li>
            ))}
          </ul>
        )}
        {featureToggles.length === 0 && <p>None for now, check back later…</p>}

        <hr />

        <h2>A/B tests</h2>
        <p
          style={{
            border: '1px solid rgba(92,184,191,1)',
            background: 'rgba(92,184,191,0.25)',
            padding: '6px 12px',
            margin: 0,
          }}
        >
          You can opt-in to a test (👍), explicitly opt-out (👎), or have us
          forget your choice. If you choose for use to forget, you will be put
          in to either group randomly according to our A/B decision rules.
        </p>
        {abTests.length > 0 && (
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {abTests.map(toggle => (
              <li
                key={toggle.id}
                style={{
                  marginTop: '18px',
                  borderTop: '1px solid #d9d6ce',
                  paddingTop: '6px',
                }}
              >
                <h3 style={{ marginRight: '6px' }}>{toggle.title}</h3>
                <p>{toggle.description}</p>
                <Button
                  onClick={() => {
                    setCookie(toggle.id, 'true', domain);
                    // $FlowFixMe
                    setToggles({
                      ...toggles,
                      [toggle.id]: true,
                    });
                  }}
                  style={{
                    opacity: toggles[toggle.id] === true ? 1 : 0.5,
                  }}
                >
                  👍 Count me in
                </Button>
                <Button
                  onClick={() => {
                    setCookie(toggle.id, 'false', domain);
                    // $FlowFixMe
                    setToggles({
                      ...toggles,
                      [toggle.id]: false,
                    });
                  }}
                  style={{
                    opacity: toggles[toggle.id] === false ? 1 : 0.5,
                  }}
                >
                  👎 No thanks
                </Button>
                <Button
                  onClick={() => {
                    setCookie(toggle.id, null, domain);
                    // $FlowFixMe
                    setToggles({
                      ...toggles,
                      [toggle.id]: undefined,
                    });
                  }}
                  opaque
                >
                  Forget my choice
                </Button>
              </li>
            ))}
          </ul>
        )}

        {abTests.length === 0 && <p>None for now, check back later…</p>}
      </div>
    </div>
  );
};

export default IndexPage;
