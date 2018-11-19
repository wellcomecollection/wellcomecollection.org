// @flow
const fontFamily = 'Gadget, sans-serif';

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

const IndexPage = () => {
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
        <p>None for now, check back later…</p>

        <hr />

        <h2>Feature toggles</h2>
        {featureToggles.length > 0 &&
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {featureToggles.map(toggle =>
              <li key={toggle.id}>
                <h3 style={{marginRight: '6px'}}>{toggle.title}</h3>
                <p>{toggle.description}</p>
                <button onClick={() => {
                  setCookie(toggle.id, 'true');
                }}>On</button>
                <button onClick={() => {
                  setCookie(toggle.id, 'false');
                }}>Off</button>
                <button onClick={() => {
                  setCookie(toggle.id);
                }}>Leave</button>
              </li>
            )}
          </ul>
        }

        {featureToggles.length === 0 && <p>None for now, check back later…</p>}

      </div>
    </div>
  );
};

export default IndexPage;
