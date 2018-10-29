// @flow
import {classNames, font, spacing} from '../../../utils/classnames';
import {trackComponentAction} from '../../../utils/ga';
import type {MultiContent} from '../../../model/multi-content';

type Props = {|
  researchLinkText: ?string,
  researchItem: ?MultiContent,
  readLinkText: ?string,
  readItem: ?MultiContent,
  visitLinkText: ?string,
  visitItem: ?MultiContent
|}

function trackAction(action: string) {
  return () => {
    trackComponentAction('Outro', action, {});
  };
}

const Outro = ({
  researchLinkText,
  researchItem,
  readLinkText,
  readItem,
  visitLinkText,
  visitItem
}: Props) => {
  return (
    <div>
      <div style={{
        width: '54px',
        height: '6px',
        background: 'black'
      }} className={classNames({
        [spacing({s: 0}, {margin: ['bottom']})]: true
      })}></div>
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
              {researchItem.type !== 'weblinks' &&
                <a
                  href={`/${researchItem.type}/${researchItem.id}`}
                  onClick={trackAction('researchItemClick')}>
                  {researchLinkText || researchItem.title}
                </a>
              }
              {researchItem.type === 'weblinks' &&
                <a
                  href={`${researchItem.url}`}
                  onClick={trackAction('researchItemClick')}>
                  {researchLinkText}
                </a>
              }
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
            })}>Read another story</h3>
            <div className={classNames({
              'body-text': true
            })}>
              {readItem.type !== 'weblinks' &&
                <a
                  href={`/${readItem.type}/${readItem.id}`}
                  onClick={trackAction('readItemClick')}>
                  {readLinkText || readItem.title}
                </a>
              }
              {readItem.type === 'weblinks' &&
                <a
                  href={`${readItem.url}`}
                  onClick={trackAction('readItemClick')}>
                  {readLinkText}
                </a>
              }
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
            })}>Plan a visit</h3>
            <div className={classNames({
              'body-text': true
            })}>
              {visitItem.type !== 'weblinks' &&
                <a
                  href={`/${visitItem.type}/${visitItem.id}`}
                  onClick={trackAction('visitItemClick')}>
                  {visitLinkText || visitItem.title}
                </a>
              }
              {visitItem.type === 'weblinks' &&
                <a
                  href={`${visitItem.url}`}
                  onClick={trackAction('visitItemClick')}>
                  {visitLinkText}
                </a>
              }
            </div>
          </li>

        }
      </ul>
    </div>
  );
};

export default Outro;
