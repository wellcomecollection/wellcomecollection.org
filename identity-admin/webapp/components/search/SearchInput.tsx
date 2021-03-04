import { useRouter } from 'next/router';
import { useState } from 'react';
import { buildSearchUrl } from '../../utils/search-util';

const SearchInput = (): JSX.Element => {
  const router = useRouter();
  const { status, name, email } = router.query;
  const [nameValue, setNameValue] = useState<string>(
    typeof name === 'string' ? name : ''
  );
  const [emailValue, setEmailValue] = useState<string>(
    typeof email === 'string' ? email : ''
  );

  const updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
  };

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const onChangeForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = buildSearchUrl('1', status, nameValue, emailValue);
  };

  return (
    <>
      <td className="user-list__filter-header">
        <form onSubmit={onChangeForm} className="user-list__search-form">
          <input
            type="text"
            placeholder="Enter name"
            value={nameValue}
            onChange={updateName}
          />
          <button type="submit">Search</button>
        </form>
      </td>
      <td className="user-list__filter-header">
        <form onSubmit={onChangeForm} className="user-list__search-form">
          <input
            type="text"
            placeholder="Enter email"
            value={emailValue}
            onChange={updateEmail}
          />
          <button type="submit">Search</button>
        </form>
      </td>
    </>
  );
};

export default SearchInput;
