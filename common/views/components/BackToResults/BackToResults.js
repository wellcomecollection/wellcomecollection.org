// @flow

import NextLink from 'next/link';
import type { NextLinkType } from '../../../model/next-link-type';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';

type Props = {|
  nextLink: NextLinkType,
|};

const BackToResults = ({ nextLink }: Props) => {
  return (
    <NextLink {...nextLink}>
      <a
        onClick={() => {
          trackEvent({
            category: 'BackToResults',
            action: 'follow link',
            label: `${nextLink.href.query.query} | page: ${nextLink.href.query
              .page || 1}`,
          });
        }}
        className={classNames({
          [font({ s: 'HNM5', m: 'HNM4' })]: true,
        })}
      >
        <span>{`Search results`}</span>
      </a>
    </NextLink>
  );
};

export default BackToResults;
