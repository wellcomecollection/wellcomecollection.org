import Inferno from 'inferno';
import spacingClasses from '../../../filters/spacing-classes';
import Icon from '../icon';

export default function Pagination({currentPage, pageCount, prevPage, nextPage}) {
  return (
    <div className={`pagination float-r flex-inline flex--center text--meta ${spacingClasses({s:2, m:2, l:2}, {margin: ['top', 'bottom']})}`}>
      {prevPage &&
        <a href={`?page=${prevPage}`} rel="prev" className={spacingClasses({s:2, m:2, l:2}, {margin: ['right']})}>
          <div className="icon-rounder flex flex--center">
            <Icon icon="ArrowBigIcon" title={`Previous (page ${prevPage})`} modifiers={['icon--90', 'icon--2x', 'h-center']} />
          </div>
        </a>}

      <span>Page {currentPage} of {pageCount}</span>

      {nextPage &&
        <a href={`?page=${nextPage}`} rel="next" className={spacingClasses({s:2, m:2, l:2}, {margin: ['left']})}>
          <div className="icon-rounder flex flex--center">
            <Icon icon="ArrowBigIcon" title={`Next (page ${nextPage})`} modifiers={['icon--270', 'icon--2x', 'h-center']} />
          </div>
        </a>}
    </div>
  );
}
