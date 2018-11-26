import {useState} from 'react';
import styled from 'styled-components';
import getCookies from 'next-cookies';
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

// Think about making a tools layout?
// Maybe pa11y could use this?
const Header = () => {
  return (
    <div style={{
      background: '#ffce3c',
      marginTop: '30px',
      marginBottom: '30px',
      position: 'relative',
      height: '60px',
      display: 'flex'
    }}>
      <h1 style={{ margin: 0, padding: 0 }}>
        <img
          src='https://i.wellcomecollection.org/assets/icons/android-chrome-512x512.png'
          width={90}
          height={90}
          alt={'Wellcome Collection logo'}
          title={'Wellcome Collection'}
          style={{
            marginTop: '-15px',
            marginLeft: '18px'
          }} />
      </h1>

      <h2 style={{
        margin: 0,
        padding: 0,
        marginLeft: '18px',
        color: '#323232',
        weight: 'normal',
        lineHeight: '2.5em'
      }}>Toggles</h2>
    </div>
  );
};

const aYear = 31536000;
function setCookie(name, value) {
  const expiration = value ? ` Max-Age=${aYear}` : `Expires=${new Date('1970-01-01').toString()}`;
  document.cookie = `toggle_${name}=${value || ''}; Path=/; Domain=wellcomecollection.org; ${expiration}`;
}

const abTests = [];

const featureToggles = [{
  id: 'unfilteredCatalogueResults',
  title: 'Unfiltered catalogue results',
  description:
    'We currently filter the results of the catalogue to only how' +
    'results that we know we have images for. This will disable that' +
    'and show everything.'
}, {
  id: 'showWorksFilters',
  title: 'Show filters on works search',
  description:
    'Exposes the filters we have available on the API on the UI.'
}];

type Props = {| initialToggles: Object |}
const IndexPage = ({ initialToggles }: Props) => {
  const [toggles, setToggles] = useState(initialToggles);

  return (
    <div style={{
      fontFamily
    }}>
      <Header />
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
                }} disabled={toggles[`${toggle.id}`] === true}>✔</Button>
                <Button onClick={() => {
                  setCookie(toggle.id, 'false');
                  toggles[toggle.id] = false;
                  setToggles(toggles);
                }} disabled={toggles[`${toggle.id}`] === false}>✘</Button>
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
                }} disabled={toggles[`${toggle.id}`] === true}>✔</Button>
                <Button onClick={() => {
                  setCookie(toggle.id, 'false');
                  toggles[toggle.id] = false;
                  setToggles(toggles);
                }} disabled={toggles[`${toggle.id}`] === false}>✘</Button>
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
