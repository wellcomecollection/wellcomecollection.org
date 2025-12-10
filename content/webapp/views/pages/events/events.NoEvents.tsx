import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Buttons from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';

import QuestionMark from './events.NoEvents.QuestionMark';

type Props = {
  isPastListing: boolean;
  hasFilters: boolean;
};

const NoResultsWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ClearFiltersText = styled(Space).attrs({
  as: 'p',
  $v: { size: 'xl', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const NoEvents: FunctionComponent<Props> = ({ isPastListing, hasFilters }) => {
  return (
    <NoResultsWrap>
      <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
        <QuestionMark />
      </Space>
      <Space
        as="p"
        $v={{ size: 'xs', properties: ['margin-bottom'] }}
        className={font('sans', 2)}
      >
        No {isPastListing ? 'past' : 'upcoming'} events found
      </Space>

      {hasFilters && (
        <>
          <ClearFiltersText>Clear your filters and try again</ClearFiltersText>
          <Buttons
            variant="ButtonSolidLink"
            link={`/events${isPastListing ? '/past' : ''}`}
            text="Clear all filters"
          />
        </>
      )}
      <Space
        $v={{ size: 'md', properties: ['margin-top'] }}
        className={font('sans', -2)}
      >
        {hasFilters ? 'Or check' : 'Check'}{' '}
        <a href={`/events${isPastListing ? '' : '/past'}`}>
          {isPastListing ? 'upcoming' : 'past'} events
        </a>
      </Space>
    </NoResultsWrap>
  );
};

export default NoEvents;
