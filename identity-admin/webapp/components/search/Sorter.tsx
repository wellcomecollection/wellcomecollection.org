import { useRouter } from 'next/router';
import { buildSearchUrl } from '../../utils/search-util';
import { SortField } from '../../interfaces';

type Props = {
  fieldName: SortField;
};

const Sorter = ({ fieldName }: Props): JSX.Element => {
  const router = useRouter();
  const { status, name, email, sort, sortDir } = router.query;

  const isCurrentlySortedField = () => {
    return fieldName === sort;
  };

  const buildSortUrl = (): string => {
    if (isCurrentlySortedField()) {
      return buildSearchUrl(
        '1',
        status,
        name,
        email,
        sort,
        sortDir === '1' ? '-1' : '1'
      );
    }
    return buildSearchUrl('1', status, name, email, fieldName, '1');
  };

  const sortSymbol = (): string => {
    if (isCurrentlySortedField()) {
      return sortDir === '1' ? '▾' : '▴';
    }
    return '▾';
  };

  return <a href={buildSortUrl()}>{sortSymbol()}</a>;
};

export default Sorter;
