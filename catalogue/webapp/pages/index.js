import {grid} from '@wellcomecollection/common/utils/classnames';
import DefaultPageLayout from '@wellcomecollection/common/views/components/DefaultPageLayout/DefaultPageLayout';
import MoreInfoLink from '@wellcomecollection/common/views/components/MoreInfoLink/MoreInfoLink';
import criticalCss from '@wellcomecollection/common/styles/critical.scss';
import BackToTop from '@wellcomecollection/common/views/components/BackToTop/BackToTop';
import Divider from '@wellcomecollection/common/views/components/Divider/Divider';
import License from '@wellcomecollection/common/views/components/License/License';

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
      <MoreInfoLink url="https://wellcomecollection.org" name="Feed me Symour" />
      <Divider modifiers={ {'pumice': true, 'keyline': true} } extraClasses = {['margin-top-s1', 'margin-bottom-s1']} />
      <BackToTop trackId='pageUrl' />
      <License subject='image.jpg' licenseType='CC-BY-NC-ND' />
    </div>
  </DefaultPageLayout>
)
