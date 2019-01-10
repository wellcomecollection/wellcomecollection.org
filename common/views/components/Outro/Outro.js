// @flow
import type {MultiContent} from '../../../model/multi-content';

import {classNames, spacing} from '../../../utils/classnames';
import {trackEvent, trackEventV2} from '../../../utils/ga';
import CompactCard from '../../components/CompactCard/CompactCard';
import Divider from '../../components/Divider/Divider';

type Props = {|
  researchLinkText: ?string,
  researchItem: ?MultiContent,
  readLinkText: ?string,
  readItem: ?MultiContent,
  visitLinkText: ?string,
  visitItem: ?MultiContent,
|}

const Outro = ({
  researchLinkText,
  researchItem,
  readLinkText,
  readItem,
  visitLinkText,
  visitItem
}: Props) => {
  function getItemInfo(item) {
    switch (item) {
      case researchItem:
        return {
          type: 'research',
          title: 'Research for yourself',
          description: item.type === 'weblinks' ? researchLinkText : researchLinkText || item.title
        };
      case readItem:
        return {
          type: 'read',
          title: 'Read another story',
          description: item.type === 'weblinks' ? readLinkText : readLinkText || item.title
        };
      case visitItem:
        return {
          type: 'visit',
          title: 'Plan a visit',
          description: item.type === 'weblinks' ? visitLinkText : visitLinkText || item.title
        };
      default:
        return {
          type: '',
          title: '',
          description: ''
        };
    }
  }

  return (
    <div>
      <Divider extraClasses={`divider--stub divider--black`} />
      <h2
        className={classNames({
          'h1': true,
          [spacing({s: 2}, {margin: ['top']})]: true
        })}>Try these next</h2>

      <ul className={classNames({
        'no-margin': true,
        'no-padding': true,
        'plain-list': true
      })}>
        {[researchItem, readItem, visitItem].filter(Boolean)
          .map(item => {
            return (
              <li key={item.id} onClick={() => {
                trackEventV2({
                  eventCategory: 'Outro',
                  eventAction: `follow ${getItemInfo(item).type} link`,
                  eventLabel: item.id
                });
                trackEvent({
                  category: 'component',
                  action: `Outro:${getItemInfo(item).type}ItemClick`,
                  label: item.id
                });
              }}>
                <CompactCard
                  partNumber={null}
                  Image={null}
                  urlOverride={null}
                  color={null}
                  StatusIndicator={null}
                  DateInfo={null}
                  title={getItemInfo(item).title}
                  promoType={``}
                  labels={{labels: item.labels || []}}
                  url={item.type === 'weblinks' ? item.url : `/${item.type}/${item.id}`}
                  description={getItemInfo(item).description} />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Outro;
