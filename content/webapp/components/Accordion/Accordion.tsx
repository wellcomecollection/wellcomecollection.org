import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import { chevron } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

type AccordionItem = {
  summary: string;
  content: ReactElement;
};

type Props = {
  id: string;
  items: AccordionItem[];
};

const ShowHide = styled(Space).attrs({
  $h: { size: 's', properties: ['margin-right'] },
  className: font('intr', 5),
})`
  text-decoration: underline;
  text-underline-offset: 0.5em;

  &::before {
    content: 'Show';
  }

  details[open] &::before {
    content: 'Hide';
  }
`;

const Summary = styled(Space).attrs({
  as: 'summary',
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: font('intr', 4),
})`
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  .icon {
    border: 2px solid ${props => props.theme.color('black')};
    border-radius: 50%;
    transition: transform ${props => props.theme.transitionProperties};

    details[open] & {
      transform: rotate(180deg);
    }
  }
`;

const Details = styled.details.attrs({
  className: font('intr', 5),
})`
  &[open] {
    padding-bottom: 20px;
  }
`;

const Accordion: FunctionComponent<Props> = ({ id, items }) => {
  return (
    <>
      {items.map(item => (
        <Details key={item.summary} name={id}>
          <Summary>
            {item.summary}{' '}
            <span style={{ display: 'flex' }}>
              <ShowHide></ShowHide>
              <Icon icon={chevron} />
            </span>
          </Summary>
          <div className="spaced-text body-text">{item.content}</div>
        </Details>
      ))}
    </>
  );
};

export default Accordion;
