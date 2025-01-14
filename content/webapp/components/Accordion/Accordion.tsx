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

// If we have these properties on the Summary directly, it prevents NVDA from
// correctly announcing expanded/collapsed state changes, so we need this extra
// element
const SummaryInner = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Summary = styled(Space).attrs({
  as: 'summary',
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: font('intr', 4),
})`
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
  cursor: pointer;

  /* The two declarations below hide the disclosure triangle without affecting
  screenreaders */
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

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
        // `name` is an allowed attribute on a `details` element, but our TS
        // (possibly NextJS's TS) setup is unhappy with it

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Details key={item.summary} name={id}>
          <Summary>
            <SummaryInner>
              {item.summary}{' '}
              <span style={{ display: 'flex' }}>
                <ShowHide></ShowHide>
                <Icon icon={chevron} />
              </span>
            </SummaryInner>
          </Summary>
          <div className="spaced-text body-text">{item.content}</div>
        </Details>
      ))}
    </>
  );
};

export default Accordion;
