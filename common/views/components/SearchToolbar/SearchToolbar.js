// @flow
import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import swagger from '../../../services/catalogue/swagger';
import Layout12 from '../Layout12/Layout12';
import Space from '../styled/Space';
import { classNames, font } from '../../../utils/classnames';
import cookies from 'next-cookies';
import TogglesContext from '../TogglesContext/TogglesContext';

const Form = styled(Space).attrs({
  className: classNames({
    flex: true,
    [font('hnl', 5)]: true,
  }),
  h: {
    size: 's',
    properties: ['padding-left', 'padding-right'],
  },
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  as: 'form',
})`
  border-bottom: 1px solid ${props => `${props.theme.color('charcoal')}`};
  background: ${props => props.theme.color('yellow')};
  align-items: center;
`;

const Heading = styled(Space).attrs({
  as: 'h2',
  className: classNames({
    'no-margin': true,
    [font('hnm', 4)]: true,
  }),
  h: {
    size: 's',
    properties: ['padding-right', 'margin-right'],
  },
})`
  border-right: 1px solid ${props => `${props.theme.color('charcoal')}`};
`;

const Section = styled.div`
  padding-right: 5px;
  margin-right: 5px;
  border-right: 1px solid ${props => `${props.theme.color('charcoal')}`};
`;

const Input = styled(Space).attrs({
  as: 'input',
  h: {
    size: 's',
    properties: ['margin-right'],
  },
})``;

const SearchToolbar = () => {
  const { unfilteredSearchResults, stagingApi } = useContext(TogglesContext);
  const [queryTypes, setQueryTypes] = useState<string[]>([]);
  const [selectedQueryType, setSelectedQueryType] = useState<?string>(null);
  const [
    unfilteredSearchResultsState,
    setUnfilteredSearchResultsState,
  ] = useState<boolean>(unfilteredSearchResults);
  const [stagingApiState, setStagingApiState] = useState<boolean>(stagingApi);

  useEffect(() => {
    const queryTypeCookie = cookies({})._queryType;
    if (queryTypeCookie) {
      setSelectedQueryType(queryTypeCookie);
    }
  }, []);

  useEffect(() => {
    swagger(stagingApi).then(swagger => {
      const queryTypesEnum = swagger.paths['/works'].get.parameters.find(
        parameter => parameter.name === '_queryType'
      ).schema.enum;

      setQueryTypes(queryTypesEnum);
    });
  }, []);

  return (
    <Layout12>
      <Form>
        <div
          className="flex"
          style={{
            alignItems: 'center',
          }}
        >
          <Heading>🔍 Search</Heading>
          <Section>
            <div className="flex">
              <div>Query type:</div>

              {queryTypes.map(queryType => (
                <label key={queryType}>
                  <Space
                    h={{
                      size: 'm',
                      properties: ['margin-left'],
                    }}
                    className={classNames({
                      flex: true,
                    })}
                  >
                    <Input
                      type="radio"
                      name="seachToolbarQueryType"
                      value={queryType}
                      checked={queryType === selectedQueryType}
                      onChange={event => {
                        const val = event.currentTarget.value;
                        console.info(val);
                        setSelectedQueryType(val);
                        document.cookie = `_queryType=${val}; path=/; max-age=31536000; SameSite=Lax;`;
                        window.location.reload();
                      }}
                    />
                    {queryType}
                  </Space>
                </label>
              ))}
            </div>
          </Section>
          <Section
            className={classNames({
              flex: true,
            })}
          >
            <label>
              <Input
                type="checkbox"
                checked={unfilteredSearchResultsState}
                name="unfilteredSearchResults"
                onChange={event => {
                  const checked = event.currentTarget.checked;
                  document.cookie = `toggle_unfilteredSearchResults=${checked}; path=/; max-age=31536000; SameSite=Lax;`;
                  setUnfilteredSearchResultsState(checked);
                  window.location.reload();
                }}
              />
              Search entire catalogue
            </label>
          </Section>
          <Section
            className={classNames({
              flex: true,
            })}
          >
            <label>
              <Input
                type="checkbox"
                checked={stagingApiState}
                name="stagingApi"
                onChange={event => {
                  const checked = event.currentTarget.checked;
                  document.cookie = `toggle_stagingApi=${checked}; path=/; max-age=31536000; SameSite=Lax;`;
                  setStagingApiState(checked);
                  window.location.reload();
                }}
              />
              Use staging API
            </label>
          </Section>
        </div>
      </Form>
    </Layout12>
  );
};

export default SearchToolbar;
