import { FunctionComponent } from 'react';

import linkResolver from '@weco/common/services/prismic/link-resolver';
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
    <a href={link()}>
      {type !== 'Page' && <span>{type}</span>}
      <h2>{title}</h2>
      <p>{description}</p>
      {dates ? (
        <p>
          <DateRange start={dates.start} end={dates.end} />
        </p>
      ) : null}
      {times ? (
        <p>
          <DateRange start={times.start} end={times.end} />
        </p>
      ) : null}
      {contributors ? <p>{contributors}</p> : null}
    </a>
  );
};

export default ContentSearchResult;
