// @flow

import {font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';

type Props = {|
  prevPage?: number,
  currentPage: number,
  pageCount: number,
  nextPage?: number,
  nextQueryString?: string,
  prevQueryString?: string
|}

const Pagination = ({prevPage, currentPage, pageCount, nextPage, nextQueryString, prevQueryString}: Props) => (
  <div className={`pagination float-r flex-inline flex--v-center font-pewter ${font({s: 'LR3', m: 'LR2'})}`}>
    {prevPage &&
      <a href={prevQueryString} rel="prev" className={`${spacing({s: 2}, {margin: ['right']})}`}>
        <div className="icon-rounder border-color-silver flex flex--v-center">
          <Icon name='arrow' title={`Previous (page ${prevPage})`} extraClasses='icon--180 h-center' />
        </div>
      </a>
    }

    <span>Page {currentPage} of {pageCount}</span>

    {nextPage &&
          <a href={nextQueryString} rel="next" className={`${spacing({s: 2}, {margin: ['left']})}`}>
            <div className="icon-rounder border-color-silver flex flex--v-center">
              <Icon name='arrow' title={`Next (page ${nextPage})`} extraClasses='h-center' />
            </div>
          </a>
    }
  </div>
);

export default Pagination;
