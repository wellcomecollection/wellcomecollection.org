// @flow
import NextLink from 'next/link';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { WorksCodec } from '../../../services/catalogue/codecs';

const BackToResults = () => {
  const link = WorksCodec.link({
    source: 'back_to_results',
  });
  const query = '';
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
