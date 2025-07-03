import { deleteCookie, getCookies, setCookie } from 'cookies-next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import Header from '../components/Header';

const fontFamily = 'Gadget, sans-serif';

const Button = styled.button<{ $opaque?: boolean }>`
  border: ${props => (props.$opaque ? 'none' : '2px solid #007868')};
  color: ${props => (props.$opaque ? 'black' : '#007868')};
  display: inline-block;
  border-radius: 2px;
  padding: 6px 10px;
  transition: background 150ms ease;
  margin-right: 18px;
`;

const ResetButton = styled(Button)`
  color: #5f0000;
  background-color: #fcdddd;
  padding: 8px 12px;
  margin: 10px 0;
  font-size: 1.03rem;
  cursor: pointer;
`;

const Status = styled.div<{ $active?: boolean }>`
  width: 10px;
  height: 10px;
  margin-left: 10px;
  margin-right: 5px;
  border-radius: 50%;
  background: ${props => (props.$active ? 'green' : 'lightgrey')};
`;

const TextBox = styled.p`
  border: 1px solid rgb(92, 184, 191, 1);
  background: rgb(92, 184, 191, 0.25);
  padding: 6px 12px;
  margin: 0;
`;

const MessageBox = styled(TextBox)<{
  $isError?: boolean;
  $isEnabled?: boolean;
}>`
  margin-bottom: 1em;
  color: ${props => {
    if (props.$isError) return 'darkred';
    return props.$isEnabled ? 'darkgreen' : 'darkblue';
  }};
  background-color: ${props => {
    if (props.$isError) return 'lightcoral';
    return props.$isEnabled ? 'lightgreen' : 'lightblue';
  }};
  font-weight: bold;
`;

const setCookieCustom = (key: string, value: 'true' | 'false') => {
  const nowPlusOneYear = new Date();
  nowPlusOneYear.setFullYear(nowPlusOneYear.getFullYear() + 1);

  setCookie(`toggle_${key}`, value, {
    domain: 'wellcomecollection.org',
    expires: nowPlusOneYear,
    secure: true,
  });
};

const deleteCookieCustom = (key: string) => {
  deleteCookie(`toggle_${key}`, { domain: 'wellcomecollection.org' });
};

type ListOfTogglesProps = {
  toggles: Toggle[];
  toggleStates: ToggleStates;
  setToggleStates: Dispatch<SetStateAction<ToggleStates>>;
};

const ListOfToggles: NextPage<ListOfTogglesProps> = ({
  toggles,
  toggleStates,
  setToggleStates,
}) => (
  <>
    {toggles.length > 0 ? (
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {toggles.map(toggle => (
          <li
            key={toggle.id}
            style={{
              marginTop: '18px',
              borderTop: '1px solid #d9d6ce',
              paddingTop: '6px',
            }}
          >
            <h4
              style={{ marginRight: '6px', marginBottom: '5px' }}
              id={`toggle-${toggle.id}`}
            >
              {toggle.title}
            </h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                color: 'grey',
              }}
            >
              Public status: <Status $active={toggle.defaultValue} />{' '}
              {toggle.defaultValue === true ? 'on' : 'off'}
            </div>
            <p>{toggle.description} </p>

            {toggle.documentationLink && (
              <p>
                <a
                  href={toggle.documentationLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read documentation
                </a>
                .
              </p>
            )}

            <Button
              onClick={() => {
                setCookieCustom(toggle.id, 'true');
                setToggleStates(() => ({
                  ...toggleStates,
                  [toggle.id]: true,
                }));
              }}
              style={{
                opacity: toggleStates[toggle.id] === true ? 1 : 0.5,
              }}
            >
              👍 On
            </Button>
            <Button
              onClick={() => {
                setCookieCustom(toggle.id, 'false');
                setToggleStates(() => ({
                  ...toggleStates,
                  [toggle.id]: false,
                }));
              }}
              style={{
                opacity: toggleStates[toggle.id] === false ? 1 : 0.5,
              }}
            >
              👎 Off
            </Button>
          </li>
        ))}
      </ul>
    ) : (
      <p>None for now, check back later…</p>
    )}
  </>
);

type Toggle = {
  id: string;
  title: string;
  defaultValue: boolean;
  description: string;
  type: 'permanent' | 'experimental' | 'test' | 'stage';
  documentationLink?: string;
};

type ToggleStates = { [id: string]: boolean | undefined };

type AbTest = {
  id: string;
  title: string;
  range: [number, number];
  defaultValue: boolean;
  description: string;
  type: 'stage';
};

const IndexPage: FunctionComponent = () => {
  const router = useRouter();
  const { enableToggle, disableToggle, resetToggles } = router.query;
  const [message, setMessage] = useState<{
    text: string;
    isError?: boolean;
    isEnabled?: boolean;
  } | null>(null);
  const [toggleStates, setToggleStates] = useState<ToggleStates>({});
  const [toggles, setToggles] = useState<Toggle[]>([]);
  const [abTests, setAbTests] = useState<AbTest[]>([]);

  // We use this over getInitialProps as it's ineffectual when an app is exported.
  useEffect(() => {
    fetch('https://toggles.wellcomecollection.org/toggles.json')
      .then(resp => resp.json())
      .then(json => {
        setToggles(json.toggles);
        setAbTests(json.tests);
      });

    const cookies = getCookies();

    const initialToggles = Object.keys(cookies).reduce((acc, key) => {
      if (key.startsWith('toggle_')) {
        acc[key.replace('toggle_', '')] = cookies[key] === 'true';
      }
      return acc;
    }, {});
    setToggleStates(initialToggles);
  }, []);

  const handleToggle = useCallback(
    (toggleId: string, action: 'enable' | 'disable') => {
      const toggleExists = toggles.some(toggle => toggle.id === toggleId);
      if (toggleExists) {
        if (action === 'enable') {
          setCookieCustom(toggleId, 'true');
          setToggleStates(prev => ({
            ...prev,
            [toggleId]: true,
          }));
          setMessage({
            text: `✅ Toggle "${toggleId}" has been successfully enabled!`,
            isError: false,
            isEnabled: true,
          });
        } else {
          deleteCookieCustom(toggleId);
          setToggleStates(prev => ({
            ...prev,
            [toggleId]: false,
          }));
          setMessage({
            text: `🔵 Toggle "${toggleId}" has been successfully disabled!`,
            isError: false,
            isEnabled: false,
          });
        }
      } else {
        setMessage({
          text: `❌ Toggle "${toggleId}" does not exist.`,
          isError: true,
        });
      }
    },
    [toggles]
  );

  const reset = useCallback(
    () =>
      setToggleStates(
        toggles.reduce((state, { id, defaultValue }) => {
          deleteCookieCustom(id);
          state[id] = defaultValue;
          return state;
        }, {})
      ),
    [toggles]
  );

  useEffect(() => {
    if (resetToggles !== undefined) {
      reset();
      setMessage({
        text: '🔄 All toggles have been reset to their default values.',
        isError: false,
      });
    } else if (enableToggle) {
      handleToggle(enableToggle as string, 'enable');
    } else if (disableToggle) {
      handleToggle(disableToggle as string, 'disable');
    }
  }, [enableToggle, disableToggle, resetToggles, handleToggle, reset]);

  const generalToggleIds = ['apiToolbar'];
  const generalToggles = toggles.filter(t => generalToggleIds.includes(t.id));
  const restOfPermanentToggles = toggles
    .filter(t => t.type === 'permanent')
    .filter(t => !generalToggleIds.includes(t.id));

  return (
    <>
      <Head>
        <title>Toggles dashboard</title>
      </Head>
      <div style={{ fontFamily }}>
        <Header title="Toggles" />
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {message && (
            <MessageBox
              $isError={message.isError}
              $isEnabled={message.isEnabled}
            >
              {message.text}
            </MessageBox>
          )}
          <TextBox>
            You can turn on a toggle on (👍) or off (👎), which will only be
            active on the browser you are currently using, so feel free to
            explore them! Toggles also have a public status which is set for
            100% of users, which is done through devs running a script.
          </TextBox>
          <ResetButton onClick={reset}>
            🗑&nbsp;&nbsp;Reset all toggles to default&nbsp;&nbsp;🔄
          </ResetButton>

          <h2>Toggles for general use</h2>

          <ListOfToggles
            toggles={generalToggles}
            toggleStates={toggleStates}
            setToggleStates={setToggleStates}
          />

          <hr style={{ margin: '3em' }} />

          <h2>Toggles for Digital team</h2>

          <h3>Permanent</h3>

          <ListOfToggles
            toggles={restOfPermanentToggles}
            toggleStates={toggleStates}
            setToggleStates={setToggleStates}
          />

          <hr style={{ margin: '3em' }} />

          <h3>Temporary</h3>

          <ListOfToggles
            toggles={toggles.filter(t => t.type === 'experimental')}
            toggleStates={toggleStates}
            setToggleStates={setToggleStates}
          />

          <hr style={{ margin: '3em' }} />

          <h3>Staging</h3>

          <ListOfToggles
            toggles={toggles.filter(t => t.type === 'stage')}
            toggleStates={toggleStates}
            setToggleStates={setToggleStates}
          />

          <hr style={{ margin: '3em' }} />

          <h2>A/B tests</h2>
          <TextBox>
            You can opt-in to a test (👍), explicitly opt-out (👎), or have us
            forget your choice. If you choose for use to forget, you will be put
            in to either group randomly according to our A/B decision rules.
          </TextBox>

          {abTests.length > 0 ? (
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
                  <h3
                    style={{ marginRight: '6px', marginBottom: '5px' }}
                    id={`toggle-${toggle.id}`}
                  >
                    {toggle.title}{' '}
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      ({toggle.range[0]} - {toggle.range[1]})
                    </span>
                  </h3>
                  <p>{toggle.description}</p>
                  <Button
                    onClick={() => {
                      setCookieCustom(toggle.id, 'true');
                      setToggleStates({
                        ...toggleStates,
                        [toggle.id]: true,
                      });
                    }}
                    style={{
                      opacity: toggleStates[toggle.id] === true ? 1 : 0.5,
                    }}
                  >
                    👍 Count me in
                  </Button>
                  <Button
                    onClick={() => {
                      setCookieCustom(toggle.id, 'false');
                      setToggleStates({
                        ...toggleStates,
                        [toggle.id]: false,
                      });
                    }}
                    style={{
                      opacity: toggleStates[toggle.id] === false ? 1 : 0.5,
                    }}
                  >
                    👎 No thanks
                  </Button>
                  <Button
                    $opaque
                    onClick={() => {
                      deleteCookieCustom(toggle.id);
                      setToggleStates({
                        ...toggleStates,
                        [toggle.id]: undefined,
                      });
                    }}
                  >
                    Forget my choice
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>None for now, check back later…</p>
          )}
        </div>
      </div>
    </>
  );
};

export default IndexPage;
