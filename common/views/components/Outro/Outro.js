// @flow
import type { MultiContent } from '../../../model/multi-content';
// $FlowFixMe (ts)
import { classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
// $FlowFixMe(tsx)
import CompactCard from '../../components/CompactCard/CompactCard';
// $FlowFixMe(tsx)
import Divider from '../../components/Divider/Divider';
// $FlowFixMe (tsx)
import Space from '../styled/Space';

type Props = {|
  researchLinkText: ?string,
  researchItem: ?MultiContent,
  readLinkText: ?string,
  readItem: ?MultiContent,
  visitLinkText: ?string,
  visitItem: ?MultiContent,
|};

const Outro = ({
  researchLinkText,
  researchItem,
  readLinkText,
  readItem,
  visitLinkText,
  visitItem,
}: Props) => {
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
          .filter(Boolean)
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
                  partNumber={null}
                  Image={null}
                  urlOverride={null}
                  color={null}
                  StatusIndicator={null}
                  DateInfo={null}
                  title={title}
                  primaryLabels={item.labels || []}
                  secondaryLabels={[]}
                  url={
                    item.type === 'weblinks'
                      ? item.url
                      : `/${item.type}/${item.id}`
                  }
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
