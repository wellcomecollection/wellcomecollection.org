import React, { useState } from 'react';

import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
// @ts-ignore
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
// @ts-ignore
import Pagination from '@weco/common/views/components/Pagination/Pagination';
// @ts-ignore
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import Table from '@weco/common/views/components/Table/Table';

export default { title: 'Wellcome Components' };

export const PrimaryButton: React.FC = () => {
  return (
    <>
      <h1>Primary button</h1>
      <SolidButton>Text</SolidButton>
      <br />
      <br />
      <a href={`https://cardigan.wellcomecollection.org/?path=/story/components--buttonsolid`} target={`_blank`}>
        Source
      </a>
    </>
  );
};

export const SecondaryButton: React.FC = () => {
  return (
    <>
      <h1>Secondary button</h1>
      <OutlinedButton>Text</OutlinedButton>
      <br />
      <br />
      <a href={`https://cardigan.wellcomecollection.org/?path=/story/components--buttonoutlined`} target={`_blank`}>
        Source
      </a>
    </>
  );
};

export const LinkButton: React.FC = () => {
  return (
    <>
      <h1>Link / button</h1>
      <a href={`javascript: void 0`}>Text</a>
    </>
  );
};

export const InputField: React.FC = () => {
  const [value, setValue] = useState();
  return (
    <>
      <h1>Input field</h1>
      <TextInput label="Enter email" value={value} setValue={setValue} />
    </>
  );
};

export const CheckboxAndLabelText: React.FC = () => {
  const [value, setValue] = useState(false);
  return (
    <>
      <h1>Checkbox and label text</h1>
      <CheckboxRadio
        type={'checkbox'}
        id={'1'}
        text={'Text'}
        checked={value}
        name={'1'}
        onChange={() => {
          setValue(v => !v);
        }}
        value={'false'}
      />
      <br />
      <br />
      <a href={`https://cardigan.wellcomecollection.org/?path=/story/components--buttonoutlined`} target={`_blank`}>
        Source
      </a>
    </>
  );
};

export const TabbedNavigation: React.FC = () => {
  const [idx, setIdx] = useState(0);
  return (
    <>
      <h1>Tabbed navigation</h1>

      <TabNav
        items={[
          { link: '#', text: 'Profile', selected: idx === 0, onClick: () => setIdx(0) },
          { link: '#', text: 'Library', selected: idx === 1, onClick: () => setIdx(1) },
        ]}
      />
    </>
  );
};

export const DefaultPagination: React.FC = () => {
  return (
    <>
      <Pagination
        prevPage={1}
        prevQueryString={`javascript: void 0`}
        nextQueryString={`javascript: void 0`}
        currentPage={2}
        pageCount={100}
        nextPage={2}
        total={10}
      />
    </>
  );
};

export const TableAdminBoard: React.FC = () => {
  return (
    <>
      <p>Note: Does not support non-textual content in the rows</p>
      <Table
        hasRowHeaders={false}
        rows={[
          ['Name', 'Email'],
          ['Test', 'test@example.org'],
          ['Test', 'test@example.org'],
          ['Test', 'test@example.org'],
        ]}
      />
    </>
  );
};
