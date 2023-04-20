import { MultiContent } from '../../types/multi-content';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { trackGaEvent } from '@weco/common/utils/ga';
import CompactCard from '../CompactCard/CompactCard';
import Divider from '@weco/common/views/components/Divider/Divider';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { FunctionComponent } from 'react';

type Props = {
  researchLinkText?: string;
  researchItem?: MultiContent;
  readLinkText?: string;
  readItem?: MultiContent;
  visitLinkText?: string;
  visitItem?: MultiContent;
};

const Outro: FunctionComponent<Props> = ({
  researchLinkText,
  researchItem,
  readLinkText,
  readItem,
  visitLinkText,
  visitItem,
}) => {
  function getItemInfo(item: MultiContent) {
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
      <Divider lineColor="black" isStub />
      <Space
        v={{
          size: 'm',
          properties: ['margin-top'],
        }}
        as="h2"
        className="h1"
      >
        Try these next
      </Space>

      <PlainList>
        {[researchItem, readItem, visitItem]
          .filter(isNotUndefined)
          .map((item, index, arr) => {
            const { type, title, description } = getItemInfo(item);

            return (
              <li
                key={item.id}
                onClick={() => {
                  trackGaEvent({
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
      </PlainList>
    </div>
  );
};

export default Outro;