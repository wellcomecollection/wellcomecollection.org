// @flow
import type {MultiContent} from '../../../model/multi-content';

import {classNames, spacing} from '../../../utils/classnames';
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
  function getItemTitle(item) {
    switch (item) {
      case researchItem:
        return 'Research for yourself';
      case readItem:
        return 'Read another story';
      case visitItem:
        return 'Plan a visit';
      default:
        return '';
    }
  }

  function getItemEmoji(item) {
    switch (item) {
      case researchItem:
        return `👩‍🔬`;
      case readItem:
        return `📖`;
      case visitItem:
        return `🏢`;
      default:
        return '';
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
              <li key={item.id}>
                <div className='flex'>
                  <div style={{
                    fontSize: '52px',
                    marginRight: '12px',
                    marginTop: '12px'
                  }}>
                    {getItemEmoji(item)}
                  </div>
                  <CompactCard
                    partNumber={null}
                    Image={null}
                    urlOverride={null}
                    color={null}
                    StatusIndicator={null}
                    DateInfo={null}
                    title={getItemTitle(item)}
                    promoType={``}
                    labels={{labels: []}}
                    url={item.type === 'weblinks' ? item.url : `/${item.type}/${item.id}`}
                    description={item.type === 'weblinks' ? researchLinkText : researchLinkText || item.title}
                    gaEventV2={{
                      eventCategory: `CompactCard`,
                      eventAction: `follow Outro ${getItemTitle(item)} link`,
                      eventLabel: item.id
                    }} />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Outro;
