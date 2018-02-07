import fetch from 'isomorphic-unfetch';
import criticalCss from '@weco/common/styles/critical.scss';
import DefaultPageLayout from '@weco/common/views/components/DefaultPageLayout/DefaultPageLayout';
import PageDescription from '@weco/common/views/components/PageDescription/PageDescription';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import WorkMedia from '@weco/common/views/components/WorkMedia/WorkMedia';

// Not sure we want to type this not dynamically
// as the API is subject to change?
type Work = Object;

type Props = {| work: Work |}

const WorkPage = ({ work }: Props) => {
  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType === 'iiif-image'
    )
  );
  const iiifInfoUrl = iiifImageLocation && iiifImageLocation.url;

  return (
    <DefaultPageLayout
      title={work.description}
      description={work.description}>
      <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      <PageDescription title='Search our images' modifiers={{hidden: true}} />
      <InfoBanner text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`} cookieName='WC_wellcomeImagesRedirect' />

      <WorkMedia id={work.id} iiifUrl={iiifInfoUrl} title={work.title} />

    </DefaultPageLayout>
  );
};

WorkPage.getInitialProps = async ({ req }) => {
  const res = await fetch(`https://api.wellcomecollection.org/catalogue/v1/works/xkuupr5a?includes=identifiers,items`);
  const json = await res.json();
  return { work: (json: Work) };
};

export default WorkPage;
