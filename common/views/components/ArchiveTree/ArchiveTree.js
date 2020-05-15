// @flow
import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Button from '@weco/common/views/components/Buttons/Button/Button';

const Container = styled.div`
  border: 1px solid ${props => props.theme.colors.pumice};
  border-radius: 6px;
  height: 200px;
  overflow: scroll;
`;
const Tree = styled(Space).attrs({
  className: classNames({ [font('lr', 5)]: true }),
  v: { size: 'm', properties: ['margin-top', 'margin-bottom'] },
})`
  transform: scale(${props => props.scale});
  transform-origin: 0 0;

  ul {
    list-style: none;
    padding-left: 0;
    margin-left: 0;
  }

  li {
    position: relative;
    list-style: none;
    font-weight: bold;
  }

  a {
    text-decoration: none;
    display: inline-block;
    padding: 10px;
    white-space: nowrap;
    :hover,
    :focus {
      text-decoration: underline;
    }
  }

  ul ul {
    padding-left: 62px;

    li {
      font-weight: normal;
    }

    li::before,
    li::after {
      content: '';
      position: absolute;
      left: -22px;
    }

    li::before {
      border-top: 2px solid #000;
      top: 20px;
      width: 22px;
      height: 0;
    }

    li::after {
      border-left: 2px solid #000;
      height: 100%;
      width: 0px;
      top: 10px;
    }

    li:last-child::after {
      height: 10px;
    }
  }
`;

const WorkLink = styled.a`
  display: inline-block;
  background: ${props => (props.selected ? '#ffce3c' : 'transparent')};
  font-weight: ${props => (props.selected ? 'bold' : 'normal')};
  border: 1px dotted black;
  border-color: ${props => (props.selected ? 'black' : 'transparent')};
  border-radius: 6px;
`;

type NestedListProps = {|
  collection: any, // TODO
  currentWork: string,
  selected: any, // TODO
|};

const NestedList = ({ collection, currentWork, selected }: NestedListProps) => {
  return (
    <ul>
      {collection.map(item => {
        return (
          <li key={item.work.id}>
            <WorkLink
              href={`/works/${item.work.id}`}
              selected={currentWork === item.work.id}
              ref={currentWork === item.work.id ? selected : null}
            >
              {item.work.title}
            </WorkLink>
            {item.children && (
              <NestedList
                collection={item.children}
                currentWork={currentWork}
                selected={selected}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

type Props = {|
  collection: any, // TODO
  currentWork: string,
|};

const ArchiveTree = ({ collection, currentWork }: Props) => {
  const [scale, setScale] = useState(0.75);
  const selected = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    const containerTop =
      container &&
      container.current &&
      container.current.getBoundingClientRect().top;
    const containerLeft =
      container &&
      container.current &&
      container.current.getBoundingClientRect().left;
    const selectedTop =
      selected &&
      selected.current &&
      selected.current.getBoundingClientRect().top;
    const selectedLeft =
      selected &&
      selected.current &&
      selected.current.getBoundingClientRect().left;
    console.log('?', selectedLeft - containerLeft);
    if (container && container.current) {
      container.current.scrollTo(
        160,
        Math.floor(selectedTop - containerTop - 80)
      ); // TODO use half container height and half selected height rather than 80
    }
    // selected &&
    //   selected.current &&
    //   selected.current.scrollIntoView({
    //     block: 'center',
    //     inline: 'nearest',
    //   });
  }, [selected, container]);
  return (
    <Container ref={container}>
      <Space v={{ size: 'm', properties: ['margin-top'] }}>
        <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
          <Button
            extraClasses="btn--primary"
            icon={'zoomOut'}
            text={'Zoom out'}
            fontFamily="hnl"
            clickHandler={() => {
              if (scale > 1) {
                setScale(scale - 1);
              } else if (scale > 0.25) {
                setScale(scale - 0.25);
              }
            }}
          />
        </Space>
        <Button
          extraClasses="btn--primary"
          icon={'zoomIn'}
          text={'Zoom in'}
          fontFamily="hnl"
          clickHandler={() => {
            if (scale < 1) {
              setScale(scale + 0.25); // TODO tidy
            } else if (scale < 3) {
              setScale(scale + 1);
            }
          }}
        />
      </Space>
      <div
        style={{
          overflow: 'scroll',
        }}
      >
        <Tree scale={scale}>
          <NestedList
            collection={collection}
            currentWork={currentWork}
            selected={selected}
          />
        </Tree>
      </div>
    </Container>
  );
};
export default ArchiveTree;
