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
import InfoBox from '@weco/common/views/components/InfoBox/InfoBox';
import type {UiExhibition} from '@weco/common/model/exhibitions';
import {font} from '@weco/common/utils/classnames';

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
    promoText: exhibition.promoText,
    image: exhibition.image,
    squareImage: exhibition.squareImage,
    widescreenImage: exhibition.widescreenImage,
    thinImage: exhibition.thinImage
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

  // Info box content
  const admissionObject = {
    title: null,
    description: [{
      type: 'paragraph',
      text: 'Free admission',
      spans: []
    }],
    icon: 'ticket'
  };

  const placeObject = (exhibition.place && {
    title: null,
    description: [{
      type: 'paragraph',
      text: `${exhibition.place.title}, level ${exhibition.place.level}`,
      spans: []
    }],
    icon: 'location'
  });

  const resourcesItems = exhibition.resources.map(resource => {
    return {
      title: null,
      description: resource.description,
      icon: resource.icon
    };
  });

  const accessibilityItems = [
    {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'Step-free access is available to all floors of the building',
        spans: []
      }],
      icon: 'a11y'
    },
    {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'Large-print guides, transcripts and magnifiers are available in the gallery',
        spans: []
      }],
      icon: 'a11yVisual'
    }
  ];

  const infoItems = [
    admissionObject,
    placeObject,
    ...resourcesItems,
    ...accessibilityItems
  ].filter(Boolean);

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
        <InfoBox title='Visit us' items={infoItems}>
          <p className={`plain-text no-margin ${font({s: 'HNL4'})}`}>
            <a href='/access'>Accessibility at Wellcome</a>
          </p>
        </InfoBox>
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
