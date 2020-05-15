// @flow
import styled from 'styled-components';
import { useState } from 'react';
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
    display: block;
    padding: 0 0 10px 10px;
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
      top: 10px;
      width: 22px;
      height: 0;
    }

    li::after {
      border-left: 2px solid #000;
      height: 100%;
      width: 0px;
      top: 0;
    }

    li:last-child::after {
      height: 10px;
    }
  }
`;

type Props = {|
  collection: any, // TODO
|};

const NestedList = ({ collection }: Props) => {
  return (
    <ul>
      {collection.map(item => {
        return (
          <li key="item.work.id">
            <a href={`/works/${item.work.id}`}>{item.work.title}</a>
            {item.children && <NestedList collection={item.children} />}
          </li>
        );
      })}
    </ul>
  );
};
const ArchiveTree = ({ collection }: Props) => {
  const [scale, setScale] = useState(1);
  return (
    <>
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
              setScale(scale + 0.25);
            } else if (scale < 3) {
              setScale(scale + 1);
            }
          }}
        />
      </Space>
      <div style={{ overflow: 'scroll' }}>
        <Tree scale={scale}>
          <NestedList collection={collection} />
        </Tree>
      </div>
    </>
  );
};
export default ArchiveTree;
