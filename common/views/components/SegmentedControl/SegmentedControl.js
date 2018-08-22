// @flow
import {Fragment} from 'react';
import {classNames, spacing, font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import {trackEvent} from '../../../utils/ga';

type Props = {|
  id: string,
  items: {| id: string, text: string, url: string |}[],
  isTabControl: boolean,
  activeId: ?string
|}

const SegmentedControl = ({
  id,
  items,
  activeId,
  isTabControl
}: Props) => {
  return (
    <div className={classNames({
      'segmented-control': true,
      'js-segmented-control': true,
      [spacing({s: 2}, {margin: ['top', 'bottom']})]: true
    })}>
      <div className={classNames({
        'segmented-control__drawer': true,
        'js-segmented-control-show-hide': true,
        'js-focus-trap': true
      })}>
        <span className='visually-hidden js-trap-reverse-end'>reset focus</span>
        <button className='segmented-control__header plain-button no-margin no-padding js-show-hide-trigger js-trap-start'>
          {items.filter(item => item.id === activeId).map(item => (
            <Fragment key={item.id}>
              <span className={classNames({
                [font({s: 'WB6'})]: true,
                [spacing({s: 2}, {padding: ['top', 'right', 'bottom', 'left']})]: true,
                'segmented-control__button-text': true,
                'flex': true,
                'bg-black': true,
                'font-white': true,
                'flex--h-space-between': true,
                'rounded-diagonal': true
              })}>
                <span className='js-segmented-control__button-text'>{item.text}</span>
                <Icon name='chevron' extraClasses='icon--white' />
              </span>
              <span className='segmented-control__close'>
                <Icon name='cross' title='Close' />
              </span>
            </Fragment>
          ))}
        </button>
        <div
          id={id}
          className={classNames({
            [spacing({s: 3}, {padding: ['left', 'right']})]: true,
            [spacing({s: 4}, {padding: ['top']})]: true,
            'segmented-control__body': true,
            'bg-white js-show-hide-drawer': true
          })}>

          <span className={classNames({
            [spacing({s: 3}, {margin: ['bottom']})]: true,
            'segmented-control__label': true,
            'block': true
          })}>See:</span>

          <ul className='segmented-control__drawer-list js-segmented-control__drawer-list no-margin no-padding plain-list'>
            {items.map((item, i) => (
              <li
                key={item.id}
                className={classNames({
                  [font({s: 'WB6'})]: true,
                  [spacing({s: 3}, {padding: ['top', 'bottom']})]: true,
                  'border-top-width-1': i === 0,
                  'segmented-control__drawer-item': true,
                  'border-bottom-width-1': true,
                  'border-color-smoke': true
                })}>
                <a
                  onClick={() => trackEvent({
                    category: 'component',
                    action: 'whats-on-daterange-picker:click',
                    label: 'title:' + item.text
                  })}
                  data-track-event={JSON.stringify({
                    category: 'component',
                    action: 'whats-on-daterange-picker:click',
                    label: 'title:' + item.text
                  })}
                  href={item.url}
                  className={classNames({
                    'js-segmented-control__drawer-link': true,
                    'segmented-control__drawer-link': true,
                    'block': true,
                    'plain-link': true,
                    'js-trap-reverse-start': i + 1 === items.length,
                    'js-proxy-tablink': isTabControl
                  })}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
          <span className='visually-hidden js-trap-end'>reset focus</span>
        </div>
      </div>
      <ul className={classNames({
        'js-segmented-control__list': true,
        'segmented-control__list': true,
        'no-margin': true,
        'no-padding': true,
        'plain-list': true,
        'border-width-1': true,
        'border-color-black': true,
        'rounded-diagonal': true,
        'overflow-hidden': true,
        'js-tablist segmented-control__list--inline': isTabControl
      })}>
        {items.map((item, i) => (
          <li
            key={item.id}
            className={classNames({
              [font({s: 'WB7'})]: true,
              'border-right-width-1 border-right-color-black': i !== items.length - 1,
              'segmented-control__item': true,
              'line-height-1': true,
              'flex': true,
              'js-tabitem segmented-control__item--inline': isTabControl
            })}>
            <a
              onClick={() => trackEvent({
                category: 'component',
                action: 'whats-on-daterange-picker:click',
                label: 'title:' + item.text
              })}
              data-track-event={JSON.stringify({
                category: 'component',
                action: 'whats-on-daterange-picker:click',
                label: 'title:' + item.text
              })}
              href={item.url}
              className={classNames({
                [spacing({s: 2}, {padding: ['top', 'right', 'bottom', 'left']})]: true,
                'is-active bg-black font-white bg-hover-pewter': item.id === activeId,
                'bg-white font-black bg-hover-pumice': item.id !== activeId,
                'block': true,
                'plain-link': true,
                'js-segmented-control__link': true,
                'segmented-control__link': true,
                'transition-bg': true,
                'no-visible-focus': true,
                'js-tablink': isTabControl
              })}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SegmentedControl;
