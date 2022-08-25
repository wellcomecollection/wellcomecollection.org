import { FunctionComponent, useContext } from 'react';
import NextLink from 'next/link';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import SearchContext from '../SearchContext/SearchContext';

const BackToResults: FunctionComponent = () => {
  const { link } = useContext(SearchContext);
  const query = link.href?.query?.query;
  const page = link.href?.query?.page;

  return (
    <NextLink {...link}>
      <a
        onClick={() => {
          trackEvent({
            category: 'BackToResults',
            action: 'follow link',
            label: `${query} | page: ${page || 1}`,
          });
        }}
        className={classNames({
          [font('intr', 5)]: true,
        })}
      >
        <span>{`Back to search${query ? ' results' : ''}`}</span>
      </a>
    </NextLink>
  );
};

export default BackToResults;
