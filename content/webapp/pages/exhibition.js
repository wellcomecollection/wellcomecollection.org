// @flow
import {Fragment} from 'react';
import {getExhibition} from '@weco/common/services/prismic/exhibitions';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import {default as BaseHeader, getFeaturedMedia} from '@weco/common/views/components/BaseHeader/BaseHeader';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import HeaderBackground from '@weco/common/views/components/BaseHeader/HeaderBackground';
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
  const DateInfo = exhibition.end ? <DateRange start={exhibition.start} end={exhibition.end} /> : <HTMLDate date={exhibition.start} />;
  const FeaturedMedia = getFeaturedMedia({
    id: exhibition.id,
    title: exhibition.title,
    contributors: exhibition.contributors,
    contributorsTitle: exhibition.contributorsTitle,
    promo: exhibition.promo,
    body: exhibition.body,
    promoImage: exhibition.promoImage,
    promoText: exhibition.promoText
  });
  const Header = (<BaseHeader
    title={exhibition.title}
    Background={<HeaderBackground hasWobblyEdge={true} />}
    TagBar={
      <div
        style={{ minHeight: '48px' }}
        data-component='exhibit-exhibition-link'
        className='async-content exhibit-exhibition-link-placeholder'
        data-endpoint={`/installations/${exhibition.id}/exhibition`}
        data-prefix-endpoint='false'></div>
    }
    DateInfo={DateInfo}
    InfoBar={<StatusIndicator start={exhibition.start} end={(exhibition.end || new Date())} />}
    Description={null}
    FeaturedMedia={FeaturedMedia}
    LabelBar={null}
    isFree={false}
    topLink={null}
  />);

  const infoItems = [{
    title: null,
    description: [{
      type: 'paragraph',
      text: 'Free admission',
      spans: []
    }],
    icon: 'ticket'
  },
    (exhibition.place && {
      title: null,
      description: exhibition.place.information,
      icon: 'location'
    }),
    ((exhibition.id === 'WgV_ACUAAIu2P_ZM') ? {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'A family activity pack is available in the gallery',
        spans: []
      }],
      icon: 'family'
    } : null),
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
    }].filter(Boolean);

  return (
    <BasePage
      id={exhibition.id}
      Header={Header}
      Body={<Body body={exhibition.body} />}
    >
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

    return {
      exhibition
    };
  }
};

export default PageWrapper(ExhibitionPage);
