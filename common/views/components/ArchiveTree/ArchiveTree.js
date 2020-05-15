// @flow
import styled from 'styled-components';
import { useState, useRef } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Button from '@weco/common/views/components/Buttons/Button/Button';

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

type Props = {|
  collection: any, // TODO
  currentWork: string,
  selected: any, // TODO
|};

const NestedList = ({ collection, currentWork, selected }: Props) => {
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
const ArchiveTree = ({ collection, currentWork }: Props) => {
  const [scale, setScale] = useState(1);
  const selected = useRef(null);
  return (;
    <>
      <Space v={{ size: 'm', properties: ['margin-top'] }}>
        <Space as="sp;an" h={{ size: 'm', properties: ['margin-right'] }}>
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
    </>
  );
};
export default ArchiveTree;
