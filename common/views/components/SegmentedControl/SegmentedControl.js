// @flow
import { Component, Fragment } from 'react';
import { classNames, font } from '../../../utils/classnames';
// $FlowFixMe (tsx)
import Icon from '../Icon/Icon';
import { trackEvent } from '../../../utils/ga';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
import styled from 'styled-components';

const DrawerItem = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
  as: 'li',
  className: classNames({
    [font('wb', 4)]: true,
    'segmented-control__drawer-item': true,
  }),
})`
  border-bottom: 1px solid ${props => props.theme.color('smoke')};

  ${props =>
    props.isFirst &&
    `
    border-top: 1px solid ${props.theme.color('smoke')};
  `}
`;

const List = styled.ul.attrs({
  className: classNames({
    'segmented-control__list': true,
    'no-margin': true,
    'no-padding': true,
    'plain-list': true,
    'rounded-diagonal': true,
    'overflow-hidden': true,
  }),
})`
  border: 1px solid ${props => props.theme.color('black')};
`;

const Item = styled.li.attrs({
  className: classNames({
    [font('wb', 6)]: true,
    'segmented-control__item': true,
    'line-height-1': true,
    flex: true,
  }),
})`
  border-right: 1px solid ${props => props.theme.color('black')};

  ${props =>
    props.isLast &&
    `
    border-right: 0;
  `}
`;

const ItemInner = styled(Space).attrs(props => ({
  as: 'a',
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },

  className: classNames({
    'is-active bg-black font-white': props.isActive,
    'bg-white font-black': !props.isActive,
    block: true,
    'plain-link': true,
    'segmented-control__link': true,
    'transition-bg': true,
    'no-visible-focus': true,
  }),
}))`
  &:hover,
  &:focus {
    background: ${props =>
      props.isActive
        ? props.theme.color('pewter')
        : props.theme.color('pumice')};
  }
`;

const Wrapper = styled.div.attrs({})`
  .segmented-control__drawer {
    display: none;

    .enhanced & {
      display: block;

      @media (min-width: ${props => props.theme.sizes.medium}px) {
        display: none;
      }
    }
  }

  ${props =>
    props.isActive &&
    `
    .segmented-control__button-text {
      display: none;
    }
  `}

  .segmented-control__close {
    display: ${props => (props.isActive ? 'block' : 'none')};
  }

  .segmented-control__header {
    width: 100%;

    ${props =>
      props.isActive &&
      `
      width: auto;
      position: fixed;
      top: 24px;
      right: 18px;
      z-index: 2;
    `}
  }

  .segmented-control__body {
    display: ${props => (props.isActive ? 'block' : 'none')};
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .segmented-control__list {
    display: flex;

    .enhanced & {
      display: none;

      @media (min-width: ${props => props.theme.sizes.medium}px) {
        display: flex;
      }
    }
  }

  &.segmented-control__list--inline {
    .enhanced & {
      @media (min-width: ${props => props.theme.sizes.medium}px) {
        display: inline-block;
      }
    }
  }

  .segmented-control__item {
    flex: 1;
  }

  .segmented-control__link {
    width: 100%;
    text-align: center;
  }
`;

type Props = {|
  id: string,
  items: {| id: string, text: string, url: string |}[],
  activeId: ?string,
  onActiveIdChange?: (id: string) => void,
  extraClasses?: string,
  ariaCurrentText?: string,
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
    this.setActiveId(
      this.props.activeId || (this.props.items[0] && this.props.items[0].id)
    );
  }

  render() {
    const { id, items, extraClasses } = this.props;
    const { activeId, isActive } = this.state;

    return (
      <Wrapper className={extraClasses} isActive={isActive}>
        <div
          className={classNames({
            'segmented-control__drawer': true,
          })}
        >
          <button className="segmented-control__header plain-button no-margin no-padding">
            {items
              .filter(item => item.id === activeId)
              .map(item => (
                <Fragment key={item.id}>
                  <Space
                    v={{
                      size: 'm',
                      properties: ['padding-top', 'padding-bottom'],
                    }}
                    h={{
                      size: 'm',
                      properties: ['padding-left', 'padding-right'],
                    }}
                    className={classNames({
                      [font('wb', 4)]: true,
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
                    <Icon name="chevron" color={'white'} />
                  </Space>
                  <span
                    className="segmented-control__close"
                    onClick={() => this.setState({ isActive: false })}
                  >
                    <Icon name="cross" title="Close" />
                  </span>
                </Fragment>
              ))}
          </button>
          <Space
            h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
            id={id}
            className={classNames({
              'segmented-control__body': true,
              'bg-white': true,
            })}
          >
            <Space
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
            </Space>

            <ul className="segmented-control__drawer-list no-margin no-padding plain-list">
              {items.map((item, i) => (
                <DrawerItem isFirst={i === 0} key={item.id}>
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
                </DrawerItem>
              ))}
            </ul>
          </Space>
        </div>
        <List>
          {items.map((item, i) => (
            <Item key={item.id} isLast={i === items.length - 1}>
              <ItemInner
                isActive={item.id === activeId}
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
                aria-current={
                  item.id === activeId
                    ? this.props.ariaCurrentText || true
                    : null
                }
              >
                {item.text}
              </ItemInner>
            </Item>
          ))}
        </List>
      </Wrapper>
    );
  }
}

export default SegmentedControl;
