// @flow
import {Component, Fragment} from 'react';
import {classNames, spacing, font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import {trackEvent} from '../../../utils/ga';

type Props = {|
  id: string,
  items: {| id: string, text: string, url: string |}[],
  isTabControl: boolean,
  activeId: ?string,
  onActiveIdChange: () => void
|}

class SegmentedControl extends Component<Props, State> {
  state = {
    activeId: null,
    isActive: false
  }

  setActiveId(id) {
    this.setState({
      activeId: id
    });

    if (this.props.onActiveIdChange) {
      this.props.onActiveIdChange(id);
    }
  }

  componentDidMount() {
    this.setActiveId(this.props.items[0].id);
  }

  render() {
    const {
      id,
      items
    } = this.props;
    const {activeId, isActive} = this.state;

    return (
      <div className={classNames({
        'segmented-control': true
      })}>
        <div className={classNames({
          'segmented-control__drawer': true,
          'is-active': isActive
        })}>
          <span className='visually-hidden'>reset focus</span>
          <button className='segmented-control__header plain-button no-margin no-padding'>
            {items.filter(item => item.id === activeId).map(item => (
              <Fragment key={item.id}>
                <span
                  className={classNames({
                    [font({s: 'WB6'})]: true,
                    [spacing({s: 2}, {padding: ['top', 'right', 'bottom', 'left']})]: true,
                    'segmented-control__button-text': true,
                    'flex': true,
                    'bg-black': true,
                    'font-white': true,
                    'flex--h-space-between': true,
                    'rounded-diagonal': true
                  })}
                  onClick={() => this.setState({ isActive: true })}>
                  <span>{item.text}</span>
                  <Icon name='chevron' extraClasses='icon--white' />
                </span>
                <span
                  className='segmented-control__close'
                  onClick={() => this.setState({isActive: false})}>
                  <Icon name='cross' title='Close' />
                </span>
              </Fragment>
            ))}
          </button>
          <div
            id={id}
            className={classNames({
              [spacing({s: 3}, {padding: ['left', 'right']})]: true,
              'segmented-control__body': true,
              'bg-white': true
            })}>

            <span className={classNames({
              [spacing({s: 3}, {margin: ['bottom']})]: true,
              'segmented-control__label': true,
              'block': true
            })}>See:</span>

            <ul className='segmented-control__drawer-list no-margin no-padding plain-list'>
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
                    onClick={(e) => {
                      const url = e.target.href;
                      const isHash = url.startsWith('#');
                      trackEvent({
                        category: 'component',
                        action: 'whats-on-daterange-picker:click',
                        label: 'title:' + item.text
                      });
                      this.setActiveId(item.id);
                      this.setState({
                        isActive: false
                      });

                      // Assume we want to
                      if (isHash) {
                        e.preventDefault();
                        return false;
                      }
                    }}
                    data-track-event={JSON.stringify({
                      category: 'component',
                      action: 'whats-on-daterange-picker:click',
                      label: 'title:' + item.text
                    })}
                    href={item.url}
                    className={classNames({
                      'segmented-control__drawer-link': true,
                      'block': true,
                      'plain-link': true
                    })}>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
            <span className='visually-hidden'>reset focus</span>
          </div>
        </div>
        <ul className={classNames({
          'segmented-control__list': true,
          'no-margin': true,
          'no-padding': true,
          'plain-list': true,
          'border-width-1': true,
          'border-color-black': true,
          'rounded-diagonal': true,
          'overflow-hidden': true
        })}>
          {items.map((item, i) => (
            <li
              key={item.id}
              className={classNames({
                [font({s: 'WB7'})]: true,
                'border-right-width-1 border-right-color-black': i !== items.length - 1,
                'segmented-control__item': true,
                'line-height-1': true,
                'flex': true
              })}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent({
                    category: 'component',
                    action: 'whats-on-daterange-picker:click',
                    label: 'title:' + item.text
                  });
                  this.setActiveId(item.id);
                  return false;
                }}
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
                  'segmented-control__link': true,
                  'transition-bg': true,
                  'no-visible-focus': true
                })}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SegmentedControl;
