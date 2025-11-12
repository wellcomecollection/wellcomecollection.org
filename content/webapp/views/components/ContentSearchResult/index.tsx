import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import Space from '@weco/common/views/components/styled/Space';
import { Addressable } from '@weco/content/services/wellcome/content/types/api';
import DateRange from '@weco/content/views/components/DateRange';
import { formatDateRangeWithMessage } from '@weco/content/views/components/StatusIndicator';

type Props = Addressable & {
  positionInList: number;
};

const Link = styled(NextLink)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Type = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
  className: font('intr', 6),
})``;

const Title = styled(Space).attrs({
  as: 'h2',
  $v: { size: 's', properties: ['margin-bottom'] },
  className: font('intb', 4),
})`
  ${Link}:hover & {
    text-decoration: underline;
  }
`;

const Description = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-bottom'] },
})``;

const DatesContributors = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const ContentSearchResult: FunctionComponent<Props> = ({
  uid,
  type,
  title,
  description,
  highlightTourType,
  tags,
  dates,
  times,
  contributors,
  positionInList,
}) => {
  return (
    <Link
      data-component="content-search-result"
      data-gtm-trigger="content_search_result"
      data-gtm-position-in-list={positionInList}
      href={linkResolver({
        uid: uid || undefined,
        type,
        highlightTourType,
        tags: tags || [],
      })}
    >
      {type !== 'Page' && <Type>{type === 'Article' ? 'Story' : type}</Type>}
      <Title>{title}</Title>
      {description ? <Description>{description}</Description> : null}
      {type === 'Exhibition' && dates?.start && dates?.end && (
        <DatesContributors>
          {
            formatDateRangeWithMessage({
              start: new Date(dates.start),
              end: new Date(dates.end),
            }).text
          }
        </DatesContributors>
      )}

      {type !== 'Exhibition' && (
        <>
          {dates?.end ? (
            <DatesContributors>
              <DateRange
                start={new Date(dates.start)}
                end={new Date(dates.end)}
              />
            </DatesContributors>
          ) : dates?.start ? (
            <DatesContributors>
              <HTMLDateAndTime variant="date" date={new Date(dates.start)} />
            </DatesContributors>
          ) : null}
          {times ? (
            <DatesContributors>
              <DateRange
                start={new Date(times.start)}
                end={new Date(times.end)}
              />
            </DatesContributors>
          ) : null}
        </>
      )}
      {contributors ? (
        <DatesContributors>{contributors}</DatesContributors>
      ) : null}
    </Link>
  );
};

export default ContentSearchResult;
