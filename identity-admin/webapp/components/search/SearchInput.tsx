import { useRouter } from 'next/router';
import { buildSearchUrl } from '../../utils/search-util';

const SearchInput = (): JSX.Element => {
  const router = useRouter();
  const { status, name, email } = router.query;

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
      <td className="user-list__filter-header">
        <form onSubmit={onChangeName} className="user-list__search-form">
          <input
            type="text"
            name="nameField"
            placeholder="Enter name"
            defaultValue={name}
          />
          <button type="submit">Search</button>
        </form>
      </td>
      <td className="user-list__filter-header">
        <form onSubmit={onChangeEmail} className="user-list__search-form">
          <input
            type="text"
            name="emailField"
            placeholder="Enter email"
            defaultValue={email}
          />
          <button type="submit">Search</button>
        </form>
      </td>
    </>
  );
};

export default SearchInput;
