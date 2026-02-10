import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import { SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import Space from '@weco/common/views/components/styled/Space';
import SelectContainer from '@weco/content/views/components/Select/Select.Container';
type Props = {
  currentQuery?: string;
  currentApiSelection?: string;
};

const predefinedTerms = [
  'brain',
  'witch',
  'chinese medicine',
  'aids',
  'flowers',
  'history of psychiatry book 21st century',
  'medicinal drugs of india',
  'medical officer of health',
  'burke and hare murders',
  'eighteenth century collections online',
];

const PrototypeSearchSelects: FunctionComponent<Props> = ({
  currentQuery,
  currentApiSelection = 'all',
}) => {
  const handleChange = () => {
    const form = document.getElementById(
      SEARCH_PAGES_FORM_ID
    ) as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <Space
      $v={{
        size: 'md',
        properties: ['margin-top', 'margin-bottom'],
      }}
      data-component="prototype-search-selects"
    >
      <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
        <h1 className={font('sans-bold', -1)}>Search the catalogue</h1>
      </Space>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
          <SelectContainer label="Select a term">
            <select
              id="semantic-search-dropdown"
              name="query"
              value={currentQuery || ''}
              onChange={handleChange}
              form={SEARCH_PAGES_FORM_ID}
            >
              <option value="">-- Select a term --</option>
              {predefinedTerms.map(term => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </SelectContainer>
        </div>

        <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
          <SelectContainer label="Search in:">
            <select
              id="api-selection"
              name="searchIn"
              value={currentApiSelection}
              onChange={handleChange}
              form={SEARCH_PAGES_FORM_ID}
            >
              <option value="all">All results</option>
              <option value="works">Alternative 1</option>
              <option value="concepts">Alternative 2</option>
              <option value="images">Alternative 3</option>
            </select>
          </SelectContainer>
        </div>
      </div>
    </Space>
  );
};

export default PrototypeSearchSelects;
