// @flow
import {Fragment} from 'react';
import {getExhibition} from '@weco/common/services/prismic/exhibitions';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import ImageLeadHeader from '@weco/common/views/components/BaseHeader/ImageLeadHeader';
import {getFeaturedMedia} from '@weco/common/views/components/BaseHeader/BaseHeader';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import Contributors from '@weco/common/views/components/Contributors/Contributors';
import Body from '@weco/common/views/components/Body/Body';
import type {UiExhibition} from '@weco/common/model/exhibitions';

type Props = {|
  exhibition: UiExhibition
|}

export const ExhibitionPage = ({
  exhibition
}: Props) => {
  const DateInfo = exhibition.end ? <DateRange start={new Date(exhibition.start)} end={new Date(exhibition.end)} /> : <HTMLDate date={new Date(exhibition.start)} />;
  const FeaturedMedia = getFeaturedMedia({
    id: exhibition.id,
    title: exhibition.title,
    contributors: exhibition.contributors,
    contributorsTitle: exhibition.contributorsTitle,
    promo: exhibition.promo,
    body: exhibition.body,
    promoImage: exhibition.promoImage,
    promoText: exhibition.promoText
  }, true);
  const Header = (<ImageLeadHeader
    Description={null}
    title={exhibition.title}
    TagBar={null}
    DateInfo={DateInfo}
    InfoBar={<StatusIndicator start={exhibition.start} end={(exhibition.end || new Date())} />}
    FeaturedMedia={FeaturedMedia}
    topLink={{url: '/exhibitions', text: 'Exhibitions'}}
  />);

  return (
    <BasePage
      id={exhibition.id}
      Header={Header}
      Body={<Body body={exhibition.body} />}>

      <Fragment>
        {exhibition.contributors.length > 0 &&
          <Contributors
            titleOverride={exhibition.contributorsTitle}
            contributors={exhibition.contributors} />
        }
      </Fragment>
    </BasePage>
  );
};

ExhibitionPage.getInitialProps = async ({req, query}) => {
  // TODO: We shouldn't need this, but do for flow as
  // `GetInitialPropsClientProps` doesn't have `req`
  if (req) {
    const {id} = query;
    const exhibition = await getExhibition(req, id);

    if (exhibition) {
      return {
        title: exhibition.title,
        exhibition
      };
    }
  }
};

export default PageWrapper(ExhibitionPage);
