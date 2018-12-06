
// @flow
// $FlowFixMe
import {useState} from 'react';
import styled from 'styled-components';
import getCookies from 'next-cookies';
import Header from '../components/Header';
const fontFamily = 'Gadget, sans-serif';

const Button = styled.button`
  border: 2px solid #007868;
  color: #007868;
  display: inline-block;
  border-radius: 50%;
  padding: 0;
  transition: background 150ms ease;
  cursor: pointer;
  width: 46px;
  height: 46px;
  margin-right: 18px;
  opacity: ${props => props.disabled || props.opaque ? 1 : 0.5};
`;

const aYear = 31536000;
function setCookie(name, value) {
  const expiration = value ? ` Max-Age=${aYear}` : `Expires=${new Date('1970-01-01').toString()}`;
  document.cookie = `toggle_${name}=${value || ''}; Path=/; Domain=wellcomecollection.org; ${expiration}`;
}

const abTests = [];

const featureToggles = [{
  id: 'showCatalogueSearchFilters',
  title: 'Catalogue search filters',
  description:
    'We currently filter the results of the catalogue to show Pictures and ' +
    'Digital images work types, and only results with images.' +
    'This will show unfilter those results, and allow for filtering.'
}, {
  id: 'showWorkRedesign',
  title: 'Show the new work page',
  description:
    'Uses the new work page design.'
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

type Props = {| initialToggles: Object |}
const IndexPage = ({ initialToggles }: Props) => {
  const [toggles, setToggles] = useState(initialToggles);

  return (
    <div style={{
      fontFamily
    }}>
      <Header title={'Toggles'} />
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2>A/B tests</h2>
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
                }} disabled={toggles[`${toggle.id}`] === true}>👍</Button>
                <Button onClick={() => {
                  setCookie(toggle.id, 'false');
                  toggles[toggle.id] = false;
                  setToggles(toggles);
                }} disabled={toggles[`${toggle.id}`] === false}>👎</Button>
                <Button onClick={() => {
                  setCookie(toggle.id);
                  delete toggles[toggle.id];
                  setToggles(toggles);
                }} opaque>Leave</Button>
              </li>
            )}
          </ul>
        }

        {abTests.length === 0 && <p>None for now, check back later…</p>}

        <hr />

        <h2>Feature toggles</h2>
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
                }} disabled={toggles[`${toggle.id}`] === true}>👍</Button>
                <Button onClick={() => {
                  setCookie(toggle.id, 'false');
                  toggles[toggle.id] = false;
                  setToggles(toggles);
                }} disabled={toggles[`${toggle.id}`] === false}>👎</Button>
                <Button onClick={() => {
                  setCookie(toggle.id);
                  delete toggles[toggle.id];
                  setToggles(toggles);
                }} opaque>Leave</Button>
              </li>
            )}
          </ul>
        }
        {featureToggles.length === 0 && <p>None for now, check back later…</p>}

      </div>
    </div>
  );
};

IndexPage.getInitialProps = (ctx) => {
  const cookies = getCookies(ctx);
  const initialToggles = Object.keys(cookies).reduce((acc, key) => {
    if (key.startsWith('toggle_')) {
      acc[key.replace('toggle_', '')] = cookies[key] === 'true';
    }
    return acc;
  }, {});

  return {
    initialToggles
  };
};

export default IndexPage;
