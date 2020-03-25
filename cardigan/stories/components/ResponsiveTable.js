import { storiesOf } from '@storybook/react';
import { classNames, font } from '../../../common/utils/classnames';
import ResponsiveTable from '../../../common/views/components/styled/ResponsiveTable';
import Readme from '../../../common/views/components/styled/ResponsiveTableREADME.md';

const ResponsiveTableExample = () => {
  const rows = [
    {
      title: 'Vol 1.',
      location: 'Closed stores Hist. 2',
      status: 'Available',
      access: 'Online request',
    },
    {
      title: 'Vol 2.',
      location: 'Closed stores Hist. 2',
      status: 'Available',
      access: 'Online request',
    },
    {
      title: 'Vol 3.',
      location: 'History of Medicine',
      status: 'Missing',
      access: 'In library',
    },
  ];
  return (
    <ResponsiveTable
      headings={['Title', 'Location/Shelfmark', 'Status', 'Access']}
    >
      <thead>
        <tr className={classNames({ [font('hnm', 5)]: true })}>
          <th>Title</th>
          <th>Location/Shelfmark</th>
          <th>Status</th>
          <th>Access</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(i => (
          <tr key={i.title} className={classNames({ [font('hnm', 5)]: true })}>
            {Object.keys(i).map(key => (
              <td key={i[key]}>
                <span className={classNames({ [font('hnl', 5)]: true })}>
                  {i[key]}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </ResponsiveTable>
  );
};

const stories = storiesOf('Components', module);
stories.add('ResponsiveTable', ResponsiveTableExample, {
  readme: { sidebar: Readme },
});
