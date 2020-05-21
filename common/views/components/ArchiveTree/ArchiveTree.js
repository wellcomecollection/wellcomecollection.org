// @flow
import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import NextLink from 'next/link';
import { workLink } from '@weco/common/services/catalogue/routes';
import Icon from '@weco/common/views/components/Icon/Icon';
import Modal from '@weco/common/views/components/Modal/Modal';
import fetch from 'isomorphic-unfetch';
import collectionTree from '@weco/catalogue/__mocks__/collection-tree';

const Container = styled.div`
  overflow: scroll;
  height: 90vh;
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
      border-top: 2px solid ${props => props.theme.colors.green};
      top: 20px;
      width: 22px;
      height: 0;
    }

    li::after {
      border-left: 2px solid ${props => props.theme.colors.green};
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
  border: 1px dotted ${props => props.theme.colors.green};
  border-color: ${props =>
    props.selected ? props.theme.colors.green : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
`;

type Collection = {|
  path: {|
    path: string,
    level: string,
    label: string,
    type: string,
  |},
  work: {|
    id: string,
    title: string,
    alternativeTitles: [],
    type: 'Work',
  |},
  children: ?(Collection[]),
|};
type NestedListProps = {|
  collection: Collection[],
  currentWork: string,
  selected: { current: HTMLElement | null },
  setShowArchiveTreeModal: boolean => void,
|};

const NestedList = ({
  collection,
  currentWork,
  selected,
  setShowArchiveTreeModal,
}: NestedListProps) => {
  return (
    <ul>
      {collection.map(item => {
        return (
          <li key={item.work.id}>
            <NextLink
              {...workLink({ id: item.work.id })}
              scroll={false}
              passHref
            >
              <WorkLink
                selected={currentWork === item.work.id}
                ref={currentWork === item.work.id ? selected : null}
                onClick={() => {
                  setShowArchiveTreeModal(false);
                }}
              >
                {item.work.title}
              </WorkLink>
            </NextLink>
            {item.children && (
              <NestedList
                collection={item.children}
                currentWork={currentWork}
                selected={selected}
                setShowArchiveTreeModal={setShowArchiveTreeModal}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

type Props = {|
  collection?: Collection[],
  currentWork: string,
|};

const ArchiveTree = ({ collection = collectionTree, currentWork }: Props) => {
  const [showArchiveTreeModal, setShowArchiveTreeModal] = useState(false);
  const [scale, setScale] = useState(1);
  const selected = useRef(null);
  const container = useRef(null);
  // For testing we only have full tree data for the Crick Archive
  const [belongsToCrickArchive, setBelongsToCrickArchive] = useState(false);
  const [
    {
      work: { title: archiveTitle },
    },
  ] = collection;
  useEffect(() => {
    const url = `https://api.wellcomecollection.org/catalogue/v2/works/${currentWork}?include=collection&_`;
    fetch(url)
      .then(resp => resp.json())
      .then(resp =>
        setBelongsToCrickArchive(resp.collection.work.id === 'hz43r7re')
      );
  }, []);

  useEffect(() => {
    const containerTop =
      (container &&
        container.current &&
        container.current.getBoundingClientRect().top) ||
      0;
    const containerLeft =
      (container &&
        container.current &&
        container.current.getBoundingClientRect().left) ||
      0;
    const containerHeight =
      (container && container.current && container.current.offsetHeight) || 0;
    const selectedTop =
      (selected &&
        selected.current &&
        selected.current.getBoundingClientRect().top) ||
      0;
    const selectedLeft =
      (selected &&
        selected.current &&
        selected.current.getBoundingClientRect().left) ||
      0;
    const selectedHeight =
      (selected && selected.current && selected.current.offsetHeight) || 0;
    if (container && container.current) {
      container.current.scrollTo(
        Math.floor(selectedLeft - containerLeft - 100),
        Math.floor(
          selectedTop - containerTop - containerHeight / 2 + selectedHeight / 2
        )
      );
    }
  });

  return belongsToCrickArchive ? (
    <Space
      v={{
        size: 'l',
        properties: ['margin-bottom'],
      }}
      className={classNames({
        row: true,
      })}
    >
      <Space v={{ size: 's', properties: ['margin-bottom'] }}>
        <button
          onClick={() => {
            setShowArchiveTreeModal(!showArchiveTreeModal);
          }}
          className={classNames({
            'btn btn--primary': true,
            [font('hnm', 5)]: true,
          })}
        >
          <Icon name="tree" />
          <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
            {`Part of the ${archiveTitle}`}
          </Space>
        </button>
      </Space>
      <Modal
        isActive={showArchiveTreeModal}
        setIsActive={setShowArchiveTreeModal}
      >
        <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
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
        <Container ref={container}>
          <Tree scale={scale}>
            <NestedList
              collection={collection}
              currentWork={currentWork}
              selected={selected}
              setShowArchiveTreeModal={setShowArchiveTreeModal}
            />
          </Tree>
        </Container>
      </Modal>
    </Space>
  ) : null;
};
export default ArchiveTree;
