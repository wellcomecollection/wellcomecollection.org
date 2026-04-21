import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import { info2 } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  h2,
  h3 {
    padding-left: 8px;
    margin-bottom: 0;
  }
`;

type Props = {
  headingLevel?: 2 | 3;
  plural?: boolean;
  children?: ReactNode;
};

const RestrictedItemMessage: FunctionComponent<Props> = ({
  headingLevel = 2,
  children,
  plural = false,
}) => {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <>
      <Title>
        <Icon icon={info2} />
        <Heading className={font('sans-bold', -1)}>
          {plural ? 'Contains restricted ' : 'Restricted '}{' '}
          {`item${plural ? 's' : ''}`}
        </Heading>
      </Title>
      <p className={font('sans', -1)}>
        Only staff with the right permissions can view{' '}
        {`${plural ? 'restricted items' : 'this item'}`} online.
      </p>
      {children}
    </>
  );
};

export default RestrictedItemMessage;
