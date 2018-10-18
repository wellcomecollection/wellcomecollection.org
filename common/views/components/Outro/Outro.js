// @flow
import {classNames, font, spacing} from '../../../utils/classnames';
import type {MultiContent} from '../../../model/multi-content';

type ContentItem = {|
  title: ?string,
  item: MultiContent
|}

type Props = {|
  researchItem: ?ContentItem,
  readItem: ?ContentItem,
  visitItem: ?ContentItem
|}

const Outro = ({
  researchItem,
  readItem,
  visitItem
}: Props) => {
  return (
    <div>
      <div style={{
        width: '54px',
        height: '6px',
        background: 'black'
      }} className={classNames({
        [spacing({s: 2}, {margin: ['bottom']})]: true
      })}></div>

      <ul className={classNames({
        'no-margin': true,
        'no-padding': true,
        'plain-list': true
      })}>
        {researchItem &&
          <li className={classNames({
            [spacing({s: 4}, {margin: ['bottom']})]: true
          })}>
            <h3 className={classNames({
              [font({s: 'HNM3'})]: true,
              'no-margin': true
            })}>Research for yourself</h3>
            <div className={classNames({
              'body-text': true
            })}>
              <a href={`${researchItem.item.type}/${researchItem.item.id}`}>
                {researchItem.title || researchItem.item.title}
              </a>
            </div>
          </li>

        }

        {readItem &&
          <li className={classNames({
            [spacing({s: 4}, {margin: ['bottom']})]: true
          })}>
            <h3 className={classNames({
              [font({s: 'HNM3'})]: true,
              'no-margin': true
            })}>Ready for something in-depth?</h3>
            <div className={classNames({
              'body-text': true
            })}>
              <a href={`${readItem.item.type}/${readItem.item.id}`}>
                {readItem.title || readItem.item.title}
              </a>
            </div>
          </li>

        }

        {visitItem &&
          <li className={classNames({
            [spacing({s: 4}, {margin: ['bottom']})]: true
          })}>
            <h3 className={classNames({
              [font({s: 'HNM3'})]: true,
              'no-margin': true
            })}>Mark your calendars</h3>
            <div className={classNames({
              'body-text': true
            })}>
              <a href={`${visitItem.item.type}/${visitItem.item.id}`}>
                {visitItem.title || visitItem.item.title}
              </a>
            </div>
          </li>

        }
      </ul>
    </div>
  );
};

export default Outro;
