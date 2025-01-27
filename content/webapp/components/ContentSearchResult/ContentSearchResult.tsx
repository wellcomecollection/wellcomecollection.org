import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import DateRange from '@weco/content/components/DateRange/DateRange';

type Props = {
  uid: string;
  type: string;
  title: string;
  description: string;
  highlightTourType?: 'audio' | 'bsl';
  tags?: string[];
  dates?: { start: Date; end: Date };
  times?: { start: Date; end: Date };
  contributors?: string;
};

const Link = styled(NextLink)`
  text-decoration: none;
  color: inherit;
`;

const Type = styled(Space).attrs({
  $v: { size: 'm', properties: ['margin-bottom'] },
  className: font('intr', 5),
})``;

const Title = styled(Space).attrs({
  as: 'h2',
  $v: { size: 's', properties: ['margin-bottom'] },
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
}) => {
  const link = (): string => {
    if (highlightTourType) {
      return `/guides/exhibitions/${uid}/${highlightTourType === 'audio' ? 'audio-without-descriptions' : 'bsl'}`;
    } else {
      return linkResolver({ uid, type, tags });
    }
  };

  return (
    <Link href={link()}>
      {type !== 'Page' && <Type>{type}</Type>}
      <Title>{title}</Title>
      <Description>{description}</Description>
      {dates ? (
        <DatesContributors>
          <DateRange start={dates.start} end={dates.end} />
        </DatesContributors>
      ) : null}
      {times ? (
        <DatesContributors>
          <DateRange start={times.start} end={times.end} />
        </DatesContributors>
      ) : null}
      {contributors ? (
        <DatesContributors>{contributors}</DatesContributors>
      ) : null}
    </Link>
  );
};

export default ContentSearchResult;
