
// @flow
// $FlowFixMe
import {useState, useEffect} from 'react';
import styled from 'styled-components';
import getCookies from 'next-cookies';
import Header from '../components/Header';
const fontFamily = 'Gadget, sans-serif';

const Button = styled.button`
  border: ${props => props.opaque ? 'none' : '2px solid #007868'};
  color: ${props => props.opaque ? 'black' : '#007868'};
  display: inline-block;
  border-radius: 2px;
  padding: 6px 10px;
  transition: background 150ms ease;
  cursor: pointer;
  margin-right: 18px;
  opacity: ${props => props.disabled || props.opaque ? 1 : 0.5};
`;

const aYear = 31536000;
function setCookie(name, value) {
  const expiration = value ? ` Max-Age=${aYear}` : `Expires=${new Date('1970-01-01').toString()}`;
  document.cookie = `toggle_${name}=${value || ''}; Path=/; Domain=wellcomecollection.org; ${expiration}`;
}

const abTests = [{
  id: 'showSingleColumnWork',
  title: 'Show work metadata in a single column',
  description:
    `Uses a single column to display work information.`
}];

const featureToggles = [{
  id: 'showCatalogueSearchFilters',
  title: 'Catalogue search filters',
  description:
    'We currently filter the results of the catalogue to show Pictures and ' +
    'Digital images work types, and only results with images.' +
    'This will show unfilter those results, and allow for filtering.'
}, {
  id: 'showWorkRedesign',
  title: 'Show the work page prototype',
  description:
    `Uses the work page prototype. Note, being in this group will take precedence ` +
    `over the 'Show the single column work page' group.`
}, {
  id: 'showSearchBoxOnWork',
  title: 'Show the search box on work pages',
  description:
    `Puts a search box above the image viewer on work pages to see if ` +
    `it has an effect on number of searches per session/pogo-sticking behaviour.`
}, {
  id: 'showRevisedOpeningHours',
  title: 'Show revised opening hours 4 weeks in advance rather than 2 weeks',
  description:
    'We only dispay revised opening hours 2 weeks before they occur.' +
    'This increases that to 4 weeks to allow some usability testing to be conducted.'
}, {
  id: 'showNewOpeningHours',
  title: 'Show new version of opening hours',
  description:
    'Shows the static version of the page to allow usability testing to be conducted.'
}];

const IndexPage = () => {
  const [toggles, setToggles] = useState({});

  // We use this over getInitialProps as it's ineffectual when an app is
  // exported.
  useEffect(() => {
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
    <div style={{
      fontFamily
    }}>
      <Header title={'Toggles'} />
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2>Feature toggles</h2>
        <p style={{
          border: '1px solid rgba(92,184,191,1)',
          background: 'rgba(92,184,191,0.25)',
          padding: '6px 12px',
          margin: 0
        }}>
          You can opt-in to testing a new feature (👍) or, prefer
          to stay opted-out (👎). If you ask us to forget your choice, it is
          effectually opting out.
        </p>
        {featureToggles.length > 0 &&
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {featureToggles.map(toggle =>
              <li key={toggle.id} style={{
                marginTop: '18px',
                borderTop: '1px solid #d9d6ce',
                paddingTop: '6px'
              }}>
                <h3 style={{marginRight: '6px'}}>{toggle.title}</h3>
                <p>{toggle.description}</p>
                <Button onClick={() => {
                  setCookie(toggle.id, 'true');
                  toggles[toggle.id] = true;
                  setToggles(toggles);
                }} disabled={toggles[`${toggle.id}`] === true}>👍 Count me in</Button>
                <Button onClick={() => {
                  setCookie(toggle.id, 'false');
                  toggles[toggle.id] = false;
                  setToggles(toggles);
                }} disabled={toggles[`${toggle.id}`] === false}>👎 No thanks</Button>
                <Button onClick={() => {
                  setCookie(toggle.id);
                  delete toggles[toggle.id];
                  setToggles(toggles);
                }} opaque>Forget my choice</Button>
              </li>
            )}
          </ul>
        }
        {featureToggles.length === 0 && <p>None for now, check back later…</p>}

        <hr />

        <h2>A/B tests</h2>
        <p style={{
          border: '1px solid rgba(92,184,191,1)',
          background: 'rgba(92,184,191,0.25)',
          padding: '6px 12px',
          margin: 0
        }}>
          You can opt-in to a test (👍), explicitly opt-out (👎), or have us
          forget your choice. If you choose for use to forget, you will be put
          in to either group randomly according to our A/B decision rules.
        </p>
        {abTests.length > 0 &&
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {abTests.map(toggle =>
              <li key={toggle.id} style={{
                marginTop: '18px',
                borderTop: '1px solid #d9d6ce',
                paddingTop: '6px'
              }}>
                <h3 style={{marginRight: '6px'}}>{toggle.title}</h3>
                <p>{toggle.description}</p>
                <Button onClick={() => {
                  setCookie(toggle.id, 'true');
                  toggles[toggle.id] = true;
                  setToggles(toggles);
                }} disabled={toggles[`${toggle.id}`] === true}>👍 Count me in</Button>
                <Button onClick={() => {
                  setCookie(toggle.id, 'false');
                  toggles[toggle.id] = false;
                  setToggles(toggles);
                }} disabled={toggles[`${toggle.id}`] === false}>👎 No thanks</Button>
                <Button onClick={() => {
                  setCookie(toggle.id);
                  delete toggles[toggle.id];
                  setToggles(toggles);
                }} opaque>Forget my choice</Button>
              </li>
            )}
          </ul>
        }

        {abTests.length === 0 && <p>None for now, check back later…</p>}

      </div>
    </div>
  );
};

export default IndexPage;
