import { MultiContent } from '../../types/multi-content';
import { isNotUndefined } from '@weco/common/utils/array';
import { classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import CompactCard from '../CompactCard/CompactCard';
import Divider from '@weco/common/views/components/Divider/Divider';
import Space from '@weco/common/views/components/styled/Space';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { FC } from 'react';

type Props = {
  researchLinkText?: string;
  researchItem?: MultiContent;
  readLinkText?: string;
  readItem?: MultiContent;
  visitLinkText?: string;
  visitItem?: MultiContent;
};

const Outro: FC<Props> = ({
  researchLinkText,
  researchItem,
  readLinkText,
  readItem,
  visitLinkText,
  visitItem,
}) => {
  function getItemInfo(item) {
    switch (item) {
      case researchItem:
        return {
          type: 'research',
          title: 'Research for yourself',
          description:
            item.type === 'weblinks'
              ? researchLinkText
              : researchLinkText || item.title,
        };
      case readItem:
        return {
          type: 'read',
          title: 'Read another story',
          description:
            item.type === 'weblinks'
              ? readLinkText
              : readLinkText || item.title,
        };
      case visitItem:
        return {
          type: 'visit',
          title: 'Plan a visit',
          description:
            item.type === 'weblinks'
              ? visitLinkText
              : visitLinkText || item.title,
        };
      default:
        return {
          type: '',
          title: '',
          description: '',
        };
    }
  }

  return (
    <div>
      <Divider color={`black`} isStub={true} />
      <Space
        v={{
          size: 'm',
          properties: ['margin-top'],
        }}
        as="h2"
        className={classNames({
          h1: true,
        })}
      >
        Try these next
      </Space>

      <ul
        className={classNames({
          'no-margin': true,
          'no-padding': true,
          'plain-list': true,
        })}
      >
        {[researchItem, readItem, visitItem]
          .filter(isNotUndefined)
          .map((item, index, arr) => {
            const { type, title, description } = getItemInfo(item);

            return (
              <li
                key={item.id}
                onClick={() => {
                  trackEvent({
                    category: 'Outro',
                    action: `follow ${type} link`,
                    label: item.id,
                  });
                }}
              >
                <CompactCard
                  title={title}
                  primaryLabels={[]}
                  secondaryLabels={[]}
                  url={item.type === 'weblinks' ? item.url : linkResolver(item)}
                  description={description}
                  xOfY={{ x: index + 1, y: arr.length }}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Outro;
