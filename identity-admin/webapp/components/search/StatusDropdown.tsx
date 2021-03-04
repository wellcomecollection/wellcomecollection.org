import { useRouter } from 'next/router';
import { useState } from 'react';
import { buildSearchUrl } from '../../utils/search-util';

const StatusDropdown = (): JSX.Element => {
  const router = useRouter();
  const { status, name, email } = router.query;
  const [statusValue] = useState<string>(
    typeof status === 'string' ? status || '' : ''
  );

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    window.location.href = buildSearchUrl('1', event.target.value, name, email);
  };

  return (
    <select onChange={onChange} value={statusValue}>
      <option hidden>Select status</option>
      <option value="any">Any</option>
      <option value="active">Active</option>
      <option value="locked">Blocked</option>
      <option value="deletePending">Pending Delete</option>
    </select>
  );
};

export default StatusDropdown;
