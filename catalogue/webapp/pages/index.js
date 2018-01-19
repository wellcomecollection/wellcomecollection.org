import {grid} from '@wellcomecollection/common/utils/classnames';
import MoreInfoLink from '@wellcomecollection/common/components/MoreInfoLink/MoreInfoLink';

export default () => (
  <div className={grid({
    s:12,
    m:12,
    l:12,
    xl:12
  })}>
    <h1>Catalogue</h1>
    <MoreInfoLink url="https://wellcomecollectiyon.org" name="Feed me Symour" />
  </div>
)
