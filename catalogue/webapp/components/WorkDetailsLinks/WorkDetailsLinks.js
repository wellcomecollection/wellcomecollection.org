// @flow
import NextLink from 'next/link';
import Space from '@weco/common/views/components/styled/Space';
import { classNames } from '@weco/common/utils/classnames';
import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';

// TODO: Fix links type
type Props = {| title: string, links: any[] |};

const WorkDetailsLinks = ({ title, links }: Props) => {
  return (
    <WorkDetailsProperty title={title}>
      <Space
        v={{
          size: 'm',
          properties: ['margin-bottom'],
        }}
        as="ul"
        className={classNames({
          'plain-list no-margin no-padding': true,
        })}
      >
        {links.map((link, i, arr) => (
          <li key={i} className="inline">
            {link.url && <NextLink href={link.url}>{link.text}</NextLink>}
            {!link.url && link}
            {arr.length - 1 !== i && ' '}
          </li>
        ))}
      </Space>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsLinks;
