import {grid} from '@wellcomecollection/common/classnames';
import Layout from '@wellcomecollection/common/components/Layout';
import MoreInfoLink from '@wellcomecollection/common/components/MoreInfoLink';

export default () => (
  <Layout>
    <div className={grid({
      s:12,
      m:12,
      l:12,
      xl:12
    })}>
      <h1>Catalogue</h1>
      <MoreInfoLink url="https://wellcomecollectiyon.org" name="Feed me Symour" />
    </div>
  </Layout>
)
