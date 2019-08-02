// @flow
import { Component, Fragment } from 'react';
import { classNames, font } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import { trackEvent } from '../../../utils/ga';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  id: string,
  items: {| id: string, text: string, url: string |}[],
  activeId: ?string,
  onActiveIdChange?: (id: string) => void,
  extraClasses?: string,
|};

type State = {|
  activeId: ?string,
  isActive: boolean,
|};

class SegmentedControl extends Component<Props, State> {
  state = {
    activeId: null,
    isActive: false,
  };

  setActiveId(id: string) {
    this.setState({
      activeId: id,
    });

    if (this.props.onActiveIdChange) {
      this.props.onActiveIdChange(id);
    }
  }

  componentDidMount() {
    this.setActiveId(this.props.activeId || this.props.items[0].id);
  }

  render() {
    const { id, items, extraClasses } = this.props;
    const { activeId, isActive } = this.state;

    return (
      <div
        className={classNames({
          'segmented-control': true,
          [extraClasses || '']: Boolean(extraClasses),
        })}
      >
        <div
          className={classNames({
            'segmented-control__drawer': true,
            'is-active': isActive,
          })}
        >
          <span className="visually-hidden">reset focus</span>
          <button className="segmented-control__header plain-button no-margin no-padding">
            {items
              .filter(item => item.id === activeId)
              .map(item => (
                <Fragment key={item.id}>
                  <VerticalSpace
                    v={{
                      size: 'm',
                      properties: ['padding-top', 'padding-bottom'],
                    }}
                    className={classNames({
                      [font('wb', 4)]: true,
                      'padding-left-12 padding-right-12': true,
                      'segmented-control__button-text': true,
                      flex: true,
                      'bg-black': true,
                      'font-white': true,
                      'flex--h-space-between': true,
                      'rounded-diagonal': true,
                    })}
                    onClick={() => this.setState({ isActive: true })}
                  >
                    <span>{item.text}</span>
                    <Icon name="chevron" extraClasses="icon--white" />
                  </VerticalSpace>
                  <span
                    className="segmented-control__close"
                    onClick={() => this.setState({ isActive: false })}
                  >
                    <Icon name="cross" title="Close" />
                  </span>
                </Fragment>
              ))}
          </button>
          <div
            id={id}
            className={classNames({
              'padding-left-12 padding-right-12': true,
              'segmented-control__body': true,
              'bg-white': true,
            })}
          >
            <VerticalSpace
              v={{
                size: 'm',
                properties: ['margin-bottom'],
              }}
              className={classNames({
                'segmented-control__label': true,
                block: true,
              })}
            >
              See:
            </VerticalSpace>

            <ul className="segmented-control__drawer-list no-margin no-padding plain-list">
              {items.map((item, i) => (
                <VerticalSpace
                  v={{
                    size: 'm',
                    properties: ['padding-top', 'padding-bottom'],
                  }}
                  as="li"
                  key={item.id}
                  className={classNames({
                    [font('wb', 4)]: true,
                    'border-top-width-1': i === 0,
                    'segmented-control__drawer-item': true,
                    'border-bottom-width-1': true,
                    'border-color-smoke': true,
                  })}
                >
                  <a
                    onClick={e => {
                      const url = e.target.getAttribute('href');
                      const isHash = url.startsWith('#');

                      trackEvent({
                        category: 'SegmentedControl',
                        action: 'select segment',
                        label: item.text,
                      });

                      this.setActiveId(item.id);
                      this.setState({
                        isActive: false,
                      });

                      // Assume we want to
                      if (isHash) {
                        e.preventDefault();
                        return false;
                      }
                    }}
                    href={item.url}
                    className={classNames({
                      'segmented-control__drawer-link': true,
                      block: true,
                      'plain-link': true,
                    })}
                  >
                    {item.text}
                  </a>
                </VerticalSpace>
              ))}
            </ul>
            <span className="visually-hidden">reset focus</span>
          </div>
        </div>
        <ul
          className={classNames({
            'segmented-control__list': true,
            'no-margin': true,
            'no-padding': true,
            'plain-list': true,
            'border-width-1': true,
            'border-color-black': true,
            'rounded-diagonal': true,
            'overflow-hidden': true,
          })}
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              className={classNames({
                [font('wb', 6)]: true,
                'border-right-width-1 border-right-color-black':
                  i !== items.length - 1,
                'segmented-control__item': true,
                'line-height-1': true,
                flex: true,
              })}
            >
              <VerticalSpace
                v={{
                  size: 'm',
                  properties: ['padding-top', 'padding-bottom'],
                }}
                as="a"
                onClick={e => {
                  const url = e.target.getAttribute('href');
                  const isHash = url.startsWith('#');

                  trackEvent({
                    category: 'SegmentedControl',
                    action: 'select segment',
                    label: item.text,
                  });

                  this.setActiveId(item.id);

                  // Assume we want to
                  if (isHash) {
                    e.preventDefault();
                    return false;
                  }
                }}
                href={item.url}
                className={classNames({
                  'padding-left-12 padding-right-12': true,
                  'is-active bg-black font-white bg-hover-pewter':
                    item.id === activeId,
                  'bg-white font-black bg-hover-pumice': item.id !== activeId,
                  block: true,
                  'plain-link': true,
                  'segmented-control__link': true,
                  'transition-bg': true,
                  'no-visible-focus': true,
                })}
              >
                {item.text}
              </VerticalSpace>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SegmentedControl;
