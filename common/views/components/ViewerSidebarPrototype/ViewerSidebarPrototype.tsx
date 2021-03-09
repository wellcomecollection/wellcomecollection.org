import { FunctionComponent, useState } from 'react';
import WorkLink from '../WorkLink/WorkLink';
import Icon from '../Icon/Icon';
import styled from 'styled-components';
import Space from '../styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';

const Inner = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})``;

const AccordionInner = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    [font('hnm', 5)]: true,
  }),
})`
  button {
    width: 100%;
    font-family: inherit;
    color: inherit;
    font-size: inherit;

    &:active,
    &:focus {
      outline: 0;
    }

    span {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
`;

const Item = styled.div`
  border-bottom: 1px solid ${props => props.theme.color('charcoal')};
`;

const AccordionItem = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Item>
      <AccordionInner onClick={() => setIsActive(!isActive)}>
        <button className={'plain-button no-margin no-padding'}>
          <span>
            <h2
              className={classNames({
                [font('hnm', 5)]: true,
                'no-margin': true,
              })}
            >
              {title}
            </h2>
            <Icon
              name={'chevron'}
              extraClasses={isActive ? 'icon--white' : 'icon--270 icon--white'}
            />
          </span>
        </button>
      </AccordionInner>
      <AccordionInner
        className={classNames({
          'is-hidden': !isActive,
        })}
      >
        {children}
      </AccordionInner>
    </Item>
  );
};

type Props = {
  workId: string;
  title: string;
};

const ViewerSidebarPrototype: FunctionComponent<Props> = ({
  workId,
  title,
}: Props) => {
  return (
    <>
      <Inner
        className={classNames({
          [font('hnm', 5)]: true,
        })}
      >
        <h1>{title}</h1>
        <WorkLink id={workId} source="viewer_back_link">
          <a
            className={classNames({
              'flex flex--v-center': true,
            })}
          >
            <Icon name={`chevron`} extraClasses={`icon--90 icon--white`} /> Back
            to full information
          </a>
        </WorkLink>
      </Inner>
      <div>
        <AccordionItem title={'License and credit'}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
            nisi asperiores vel assumenda vero dicta, reiciendis dolore
            voluptate eos illo. Quaerat itaque quia assumenda rem doloribus
            temporibus cum praesentium asperiores?
          </p>
        </AccordionItem>
        <AccordionItem title={'Contents'}>
          <p>Cover</p>
          <p>Title page</p>
          <p>Table of contents</p>
          <p>Date 1484</p>
          <p>Medical receipts</p>
          <p>Astrological and astronomical notes</p>
          <p>Cover</p>
        </AccordionItem>
        <AccordionItem title={'Search within this item'}></AccordionItem>
      </div>
    </>
  );
};

export default ViewerSidebarPrototype;
