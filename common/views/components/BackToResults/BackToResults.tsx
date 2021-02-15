import { FunctionComponent } from 'react';
import NextLink from 'next/link';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { worksLink } from '../../../services/catalogue/routes';
import useSavedSearchState from '../../../hooks/useSavedSearchState';

const BackToResults: FunctionComponent = () => {
  const [savedSearchState] = useSavedSearchState({});
  const { query } = savedSearchState;

  const link = worksLink(
    {
      ...savedSearchState,
    },
    'back_to_results'
  );
  return (
    <NextLink {...link}>
      <a
        onClick={() => {
          trackEvent({
            category: 'BackToResults',
            action: 'follow link',
            label: `${link.href.query.query} | page: ${link.href.query.page ||
              1}`,
          });
        }}
        className={classNames({
          [font('hnm', 5)]: true,
        })}
      >
        <span>{`Back to search${query ? ' results' : ''}`}</span>
      </a>
    </NextLink>
  );
};

export default BackToResults;
