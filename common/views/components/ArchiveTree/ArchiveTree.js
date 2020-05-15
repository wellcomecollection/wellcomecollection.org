// @flow
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font, classNames } from '@weco/common/utils/classnames';

const Tree = styled(Space).attrs({
  className: classNames({ [font('lr', 6)]: true }),
  v: { size: 'l', properties: ['margin-top', 'margin-bottom'] },
})`
  list-style: none;
  padding-left: 0;

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
  return (
    <div style={{ border: '1px solid transparent', overflow: 'scroll' }}>
      <Tree>
        <NestedList collection={collection} />
      </Tree>
    </div>
  );
};
export default ArchiveTree;
