// @flow
import NextLink from 'next/link';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { worksUrl, searchQueryParams } from '../../../services/catalogue/urls';

const BackToResults = () => {
  const {
    query,
    workType,
    page,
    itemsLocationsLocationType,
    _queryType,
    _dateFrom,
    _dateTo,
    _isFilteringBySubcategory,
  } = searchQueryParams();

  const link = worksUrl({
    query,
    page,
    workType,
    itemsLocationsLocationType,
    _queryType,
    _dateFrom,
    _dateTo,
    _isFilteringBySubcategory,
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
