// @flow
import NextLink from 'next/link';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { worksUrl } from '../../../services/catalogue/urls';
import { searchQueryParams } from '../../../services/catalogue/search-params';

const BackToResults = () => {
  const params = searchQueryParams();
  const { query } = params;

  const link = worksUrl({
    ...params,
  });
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
        <span>{`Search${query ? ' results' : ''}`}</span>
      </a>
    </NextLink>
  );
};

export default BackToResults;
