import criticalCss from '@wellcomecollection/common/styles/critical.scss';
import DefaultPageLayout from '@wellcomecollection/common/views/components/DefaultPageLayout/DefaultPageLayout';
import PageDescription from '@wellcomecollection/common/views/components/PageDescription/PageDescription';
import InfoBanner from '@wellcomecollection/common/views/components/InfoBanner/InfoBanner';

const Works = () => (
  <DefaultPageLayout
    title='Image catalogue search | Wellcome Collection'
    description='Search through the Wellcome Collection image catalogue'
  >
    <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
    <PageDescription title='Search our images' modifiers={{hidden: true}} />
    <InfoBanner text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`} cookieName='WC_wellcomeImagesRedirect' />

  </DefaultPageLayout>
);

export default Works;
