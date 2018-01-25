import {grid} from '@wellcomecollection/common/utils/classnames';
import DefaultPageLayout from '@wellcomecollection/common/views/components/DefaultPageLayout/DefaultPageLayout';
import MoreInfoLink from '@wellcomecollection/common/views/components/MoreInfoLink/MoreInfoLink';
import criticalCss from '@wellcomecollection/common/styles/critical.scss';

export default () => (
  <DefaultPageLayout>
    <div className={grid({
      s:12,
      m:12,
      l:12,
      xl:12
    })}>
      <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      <h1>Catalogue</h1>
      <MoreInfoLink url="https://wellcomecollectiyon.org" name="Feed me Symour" />
    </div>
  </DefaultPageLayout>
)
