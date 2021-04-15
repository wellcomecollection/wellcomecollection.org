import { useRouter } from 'next/router';
import { buildSearchUrl } from '../../utils/search-util';
import { useState } from 'react';

const SearchInput = (): JSX.Element => {
  const router = useRouter();
  const { status, name, email } = router.query;
  const [nameInput, setNameInput] = useState<string>();
  const [emailInput, setEmailInput] = useState<string>();

  const onChangeName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = buildSearchUrl(
      '1',
      status,
      event.currentTarget.nameField.value,
      email
    );
  };

  const onChangeEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = buildSearchUrl(
      '1',
      status,
      name,
      event.currentTarget.emailField.value
    );
  };

  return (
    <>
      <th className="user-list__filter-header user-list__first">
        <form onSubmit={onChangeName} className="user-list__search-form">
          <input
            type="text"
            name="nameField"
            placeholder="Enter name"
            aria-label="Enter name"
            value={nameInput}
            defaultValue={name}
            onChange={event => setNameInput(event.target.value)}
          />
          <span
            className="user-list__clear-search"
            onClick={() => setNameInput('')}
          >
            x
          </span>
          <button type="submit">Search</button>
        </form>
      </th>
      <th className="user-list__filter-header">
        <form onSubmit={onChangeEmail} className="user-list__search-form">
          <input
            type="text"
            name="emailField"
            placeholder="Enter email"
            aria-label="Enter email"
            value={emailInput}
            defaultValue={email}
            onChange={event => setEmailInput(event.target.value)}
          />
          <span
            className="user-list__clear-search"
            onClick={() => setEmailInput('')}
          >
            x
          </span>
          <button type="submit">Search</button>
        </form>
      </th>
    </>
  );
};

export default SearchInput;
