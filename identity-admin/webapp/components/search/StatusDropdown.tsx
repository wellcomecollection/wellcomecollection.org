import { useRouter } from 'next/router';
import { useState } from 'react';
import { buildSearchUrl } from '../../utils/search-util';

const StatusDropdown = (): JSX.Element => {
  const router = useRouter();
  const { status, name, email } = router.query;
  const [statusValue] = useState<string>(
    typeof status === 'string' ? status || '' : ''
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const statuses: { key: string; value: string }[] = [
    {
      key: 'any',
      value: 'Any',
    },
    {
      key: 'active',
      value: 'Active',
    },
    {
      key: 'locked',
      value: 'Blocked',
    },
    {
      key: 'deletePending',
      value: 'Pending delete',
    },
  ];

  const statusLabel = (): string => {
    return (
      statuses
        .filter(s => s.key === statusValue)
        .map(s => s.value)
        .pop() || 'Select status'
    );
  };

  return (
    <div className="status-dropdown">
      <div className="status-dropdown__label" onClick={toggleExpansion}>
        <span>{statusLabel()}</span>
        <span className="status-dropdown__label-arrow">
          {isExpanded ? '▴' : '▾'}
        </span>
      </div>
      {isExpanded && (
        <div className="status-dropdown__options">
          {statuses.map((statusEntry, i) => {
            return (
              <a
                className="status-dropdown__option"
                key={i}
                href={buildSearchUrl('1', statusEntry.key, name, email)}
              >
                {statusEntry.value}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
