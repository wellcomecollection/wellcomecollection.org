// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import {default as PageHeader, getFeaturedMedia} from '../PageHeader/PageHeader';
import Body from '../Body/Body';
import DateAndStatusIndicator from '../DateAndStatusIndicator/DateAndStatusIndicator';
import Contributors from '../Contributors/Contributors';
import HeaderBackground from '../BaseHeader/HeaderBackground';
import type {UiInstallation} from '../../../model/installations';

type Props = {|
  installation: UiInstallation,
  showContributorsTitle: boolean
|}

const InstallationPage = ({
  installation
}: Props) => {
  const FeaturedMedia = getFeaturedMedia({
    id: installation.id,
    title: installation.title,
    contributors: installation.contributors,
    contributorsTitle: installation.contributorsTitle,
    promo: installation.promo,
    body: installation.body,
    standfirst: installation.standfirst,
    promoImage: installation.promoImage,
    promoText: installation.promoText,
    image: installation.image,
    squareImage: installation.squareImage,
    widescreenImage: installation.widescreenImage,
    labels: installation.labels
  });

  const breadcrumbs = { items: [{ text: 'Installations' }] };
  const Header = <PageHeader
    breadcrumbs={breadcrumbs}
    labels={{labels: installation.labels}}
    title={installation.title}
    FeaturedMedia={FeaturedMedia}
    Background={<HeaderBackground hasWobblyEdge={true} />}
    ContentTypeInfo={
      <DateAndStatusIndicator
        start={installation.start}
        end={installation.end} />
    }
    HeroPicture={null}
  />;

  return (
    <BasePage
      id={installation.id}
      Header={Header}
      Body={<Body body={installation.body} />}
    >
      <Fragment>
        {installation.contributors.length > 0 &&
          <Contributors
            titleOverride={installation.contributorsTitle}
            contributors={installation.contributors} />
        }
      </Fragment>
    </BasePage>
  );
};

export default InstallationPage;
